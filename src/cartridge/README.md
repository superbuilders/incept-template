# Course Cartridge System

A strictly validated, integrity-checked packaging system for course content and assessments.

## Philosophy

**Write-time validation, read-time trust.** All JSON is Zod-validated during packaging; cartridges are checksummed; reads validate integrity once at open, then trust the data structure without re-validating schemas.

## Data Model

```
Cartridge (tar.zst archive)
├── index.json              # Top-level manifest (version 1)
├── integrity.json          # SHA-256 checksums for all files
├── units/
│   └── unit-{id}.json      # Unit metadata + lesson refs
├── lessons/
│   └── unit-{id}/
│       └── lesson-{id}.json  # Lesson metadata + resource refs
├── content/
│   └── {group}/{slug}/
│       └── stimulus.html   # Article content
├── videos/
│   └── {group}/{lessonSlug}/{videoId}.json  # Hydrated video metadata
├── quizzes/
│   └── quiz-{unit}-{lesson}/
│       ├── question-{nn}.xml
│       └── question-{nn}-structured.json
└── tests/
    └── unit-{n}-test/
        ├── question-{nn}.xml
        └── question-{nn}-structured.json
```

### Hierarchy

- **Index**: Root manifest listing all units and required course metadata
- **Unit**: Contains lessons and optional unit test
- **Lesson**: Contains resources (articles, videos, and/or quizzes)
- **Resource**: Article (`stimulus.html`), video (metadata JSON with YouTube details), or quiz (collection of questions)

## Building a Cartridge (In-Memory)

Use the builder to validate and produce a tar.zst without temp files.

```ts
import { buildCartridgeToFile, buildCartridgeToBytes, type CartridgeBuildInput } from "@superbuilders/qti-assessment-item-generator/cartridge/build/builder"

const input: CartridgeBuildInput = {
  generator: { name: "qti-assessment-item-generator", version: "1.0.0" },
  course: { title: "English 09, Part 1", subject: "English" },
  units: [
    {
      id: "unit-1",
      unitNumber: 1,
      title: "Unit 1- Short Fiction - Literary Elements",
      lessons: [
        {
          id: "lesson-1-1",
          unitId: "unit-1",
          lessonNumber: 1,
          title: "1.1 Plot Structure",
          resources: [
            { id: "article-intro", type: "article", path: "content/unit-1--short-fiction---literary-elements/1-1-plot-structure/stimulus.html" },
            {
              id: "lesson-1-1-video-01",
              type: "video",
              slug: "lesson-1-1-video-01",
              path: "videos/unit-1--short-fiction---literary-elements/1-1-plot-structure/lesson-1-1-video-01.json",
              youtubeId: "AAAAAAAAAAA",
              durationSeconds: 120,
              description: "Sample description",
              title: "Plot Structure Overview"
            },
            {
              id: "quiz-1-1",
              type: "quiz",
              path: "quizzes/quiz-1-1",
              questionCount: 2,
              questions: [
                { number: 1, xml: "quizzes/quiz-1-1/question-01.xml", json: "quizzes/quiz-1-1/question-01-structured.json" },
                { number: 2, xml: "quizzes/quiz-1-1/question-02.xml", json: "quizzes/quiz-1-1/question-02-structured.json" }
              ]
            }
          ]
        }
      ]
    }
  ],
  files: {
    "content/unit-1/intro/stimulus.html": new TextEncoder().encode("<html>...</html>"),
    "quizzes/quiz-1-1/question-01.xml": new TextEncoder().encode("<assessmentItem>...</assessmentItem>"),
    "quizzes/quiz-1-1/question-01-structured.json": new TextEncoder().encode("{\"a\":1}"),
    "quizzes/quiz-1-1/question-02.xml": new TextEncoder().encode("<assessmentItem>...</assessmentItem>"),
    "quizzes/quiz-1-1/question-02-structured.json": new TextEncoder().encode("{\"b\":2}")
  }
}

// Write to file atomically
await buildCartridgeToFile(input, "./course-cartridge-v1.tar.zst")

// OR get bytes directly
const bytes = await buildCartridgeToBytes(input)
```

### Guarantees
- Zod-validated writes for `lesson.json`, `unit.json`, and `index.json` (strict: unexpected fields are rejected)
- Integrity manifest generated in-memory and included as `integrity.json`
- No temp files or directory staging necessary
- Deterministic ordering enforced via required `unitNumber` and `lessonNumber`
- Required fields: `Lesson.title`, `Lesson.lessonNumber`, `Unit.title`, `Unit.unitNumber`, `Unit.counts`, `IndexV1.generator`, `IndexV1.course`

## Reading a Cartridge

### Opening

```ts
import { openCartridgeTarZst } from "@superbuilders/qti-assessment-item-generator/cartridge/readers/tarzst"

const reader = await openCartridgeTarZst("./course-cartridge-v1.tar.zst")
```

Integrity is validated on open; subsequent reads trust shapes and only JSON.parse is used (no Zod at read-time).

### Iteration helpers

```ts
import {
  iterUnits,
  iterUnitLessons,
  iterLessonResources,
  readArticleContent,
  readVideoMetadata,
  readQuestionXml,
  readQuestionJson
} from "@superbuilders/qti-assessment-item-generator/cartridge/client"

for await (const unit of iterUnits(reader)) {
  for await (const lesson of iterUnitLessons(reader, unit)) {
    for await (const resource of iterLessonResources(reader, lesson)) {
      // ...
      if (resource.type === "video") {
        const metadata = await readVideoMetadata(reader, resource)
        // inspect metadata as needed
      }
    }
  }
}

// On-demand helpers
const html = await readArticleContent(reader, "content/unit-1--short-fiction---literary-elements/1-1-plot-structure/stimulus.html")
const xml = await readQuestionXml(reader, "quizzes/quiz-1-1/question-01.xml")
const json = await readQuestionJson(reader, "quizzes/quiz-1-1/question-01-structured.json")
```

## Building a Cartridge (From Disk File Map)

If your content already exists on disk, use the file map builder to stream files into a cartridge without loading them all into memory:

```ts
import { buildCartridgeFromFileMap, type GeneratorInfo, type BuildUnit } from "@superbuilders/qti-assessment-item-generator/cartridge/build/builder"

const generator: GeneratorInfo = { name: "qti-assessment-item-generator", version: "1.0.0" }

const units: BuildUnit[] = [
  {
    id: "unit-1",
    unitNumber: 1,
    title: "Unit 1",
    lessons: [
      {
        id: "lesson-1-1",
        unitId: "unit-1",
        lessonNumber: 1,
        title: "Introduction to Fractions",
        resources: [
          { id: "article-intro", type: "article", path: "content/unit-1/intro/stimulus.html" },
          {
            id: "quiz-1-1",
            type: "quiz",
            path: "quizzes/quiz-1-1",
            questionCount: 2,
            questions: [
              { number: 1, xml: "quizzes/quiz-1-1/question-01.xml", json: "quizzes/quiz-1-1/question-01-structured.json" },
              { number: 2, xml: "quizzes/quiz-1-1/question-02.xml", json: "quizzes/quiz-1-1/question-02-structured.json" }
            ]
          }
        ]
      }
    ]
  }
]

// Absolute source file paths → cartridge-relative destination paths (POSIX)
const files = {
  "content/unit-1/intro/stimulus.html": "/abs/content/unit-1/intro/stimulus.html",
  "quizzes/quiz-1-1/question-01.xml": "/abs/quizzes/quiz-1-1/question-01.xml",
  "quizzes/quiz-1-1/question-01-structured.json": "/abs/quizzes/quiz-1-1/question-01-structured.json",
  "quizzes/quiz-1-1/question-02.xml": "/abs/quizzes/quiz-1-1/question-02.xml",
  "quizzes/quiz-1-1/question-02-structured.json": "/abs/quizzes/quiz-1-1/question-02-structured.json"
}

await buildCartridgeFromFileMap({ generator, course: { title: "English 09, Part 1", subject: "English" }, units, files }, "./course-cartridge-v1.tar.zst")
```

### Validation and Path Rules

- All JSON entries (`index.json`, `units/*.json`, `lessons/*/*.json`) are strictly validated with Zod at write time.
- `files` must be a complete set: every referenced path in lessons/resources must exist in `files`, and there must be no extras.
- Cartridge paths are POSIX relative (no leading `/`, no `\\`); use forward slashes.
- Integrity is computed for every file and saved to `integrity.json` (sha256 + size). Integrity is verified on open.

## API Reference

### Creation (write-time)

- `buildCartridgeToBytes(input: CartridgeBuildInput): Promise<Uint8Array>`
- `buildCartridgeToFile(input: CartridgeBuildInput, outFile: string): Promise<void>`
- `buildCartridgeFromFileMap(plan: { generator: GeneratorInfo; course: { title: string; subject: string }; units: BuildUnit[]; files: CartridgeFileMap }, outFile: string): Promise<void>`
- Types: `GeneratorInfo`, `CartridgeBuildInput`, `BuildUnit`, `CartridgeFileMap`

### Reading (read-time)

- `openCartridgeTarZst(path: string): Promise<CartridgeReader>`
- `createTarZstReader(path: string): Promise<CartridgeReader>` (no integrity check)
- `validateIntegrity(reader: CartridgeReader): Promise<{ ok: boolean; issues: { path: string; reason: string }[] }>`
- Iteration helpers: `iterUnits(reader)`, `iterUnitLessons(reader, unit)`, `iterLessonResources(reader, lesson)`
- Direct content: `readIndex`, `readUnit`, `readLesson`, `readArticleContent`, `readQuestionXml`, `readQuestionJson`
- Types: `CartridgeReader`, plus `IndexV1`, `Unit`, `Lesson`, `Resource` in `@/cartridge/types`

### Package-level exports (Cartridge)

These subpath exports are available from the published package for the cartridge system:

- `@superbuilders/qti-assessment-item-generator/cartridge/build/builder`
  - Exports: `buildCartridgeToBytes`, `buildCartridgeToFile`, `buildCartridgeFromFileMap`
  - Types: `GeneratorInfo`, `CartridgeBuildInput`, `BuildUnit`, `CartridgeFileMap`

- `@superbuilders/qti-assessment-item-generator/cartridge/client`
  - Exports: `iterUnits`, `iterUnitLessons`, `iterLessonResources`, `readIndex`, `readUnit`, `readLesson`, `readArticleContent`, `readQuestionXml`, `readQuestionJson`, `validateIntegrity`

- `@superbuilders/qti-assessment-item-generator/cartridge/readers/tarzst`
  - Exports: `openCartridgeTarZst`, `createTarZstReader`

- `@superbuilders/qti-assessment-item-generator/cartridge/types`
  - Types: `IndexV1`, `Unit`, `Lesson`, `Resource`, `UnitTest`, `IntegrityManifest`, `IntegrityEntry`

- `@superbuilders/qti-assessment-item-generator/cartridge/schema`
  - Schemas: `IndexV1Schema`, `UnitSchema`, `LessonSchema`, `ResourceSchema`, `ResourceArticleSchema`, `ResourceQuizSchema`, `QuestionRefSchema`, `IntegritySchema`

- `@superbuilders/qti-assessment-item-generator/cartridge/reader`
  - Types: `CartridgeReader`

## Types and Schemas

- Types: `@superbuilders/qti-assessment-item-generator/cartridge/types`
- Schemas: `@superbuilders/qti-assessment-item-generator/cartridge/schema`

## Design Principles

1. Single format: tar.zst only
2. No fallbacks: missing or invalid data fails immediately
3. Strict validation on write; checksum validation on open
4. Fast, simple reads post-open

## Migration Notes

- Removed directory reader and file-based helper APIs
- Replaced packaging script to build directly from in-memory inputs
