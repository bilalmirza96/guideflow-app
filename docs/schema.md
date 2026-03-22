# Database Schema (Drizzle ORM)

## Core Tables

### hospitals
```typescript
export const hospitals = pgTable('hospitals', {
  id: uuid('id').primaryKey().defaultRandom(),
  subdomain: varchar('subdomain', { length: 63 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  logo_url: text('logo_url'),
  allowed_domains: text('allowed_domains').array(), // ['stmichaels.org','stmichaels.com']
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

### users
```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 50 }).notNull().default('resident'),
  // 'resident' | 'attending' | 'program_director' | 'gme_coordinator' | 'hospital_admin' | 'developer'
  pgy_year: integer('pgy_year'), // 1-5, null for non-residents
  current_rotation_id: uuid('current_rotation_id'), // FK to rotations, nullable
  fellowship_goal: varchar('fellowship_goal', { length: 100 }), // e.g. 'Colorectal Surgery'
  orcid_id: varchar('orcid_id', { length: 50 }), // ORCID identifier
  program_name: varchar('program_name', { length: 255 }), // e.g. 'General Surgery'
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  last_active_at: timestamp('last_active_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueEmail: unique().on(table.email, table.hospital_id),
}));
```

### magic_links
```typescript
export const magicLinks = pgTable('magic_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).unique().notNull(),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  expires_at: timestamp('expires_at').notNull(),
  used_at: timestamp('used_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

### guidelines
```typescript
export const guidelines = pgTable('guidelines', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content'), // rich text / free text body
  specialty: varchar('specialty', { length: 100 }).notNull(),
  version: integer('version').notNull().default(1),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  // 'draft' | 'published' | 'archived'
  pdf_url: text('pdf_url'), // R2 URL (current version)
  tags: text('tags').array(),
  evidence_strength: varchar('evidence_strength', { length: 20 }),
  // 'strong' | 'moderate' | 'weak' | 'institutional' — Phase 2 evidence tags
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_by: uuid('created_by').references(() => users.id),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  // Phase 2: search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || coalesce(content, ''))) STORED
  // Phase 3: embedding vector(1536)
});
```

### ratings
```typescript
export const ratings = pgTable('ratings', {
  id: uuid('id').primaryKey().defaultRandom(),
  guideline_id: uuid('guideline_id').references(() => guidelines.id).notNull(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  score: integer('score').notNull(), // 1-5
  comment: text('comment'),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueRating: unique().on(table.guideline_id, table.user_id),
}));
```

## Directory Tables

### contacts
```typescript
export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }),
  service: varchar('service', { length: 100 }).notNull(),
  // e.g. 'General Surgery', 'Trauma', 'Vascular', 'Transplant'
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  pager: varchar('pager', { length: 50 }),
  role_type: varchar('role_type', { length: 50 }),
  // 'attending' | 'fellow' | 'resident' | 'nurse_practitioner' | 'coordinator'
  is_active: boolean('is_active').default(true),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
```

## Case Log Tables

### case_logs
```typescript
export const caseLogs = pgTable('case_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  case_id: varchar('case_id', { length: 50 }), // supports E-code prefix for vascular
  case_date: date('case_date').notNull(),
  pgy_year: integer('pgy_year').notNull(), // 1-5
  rotation: varchar('rotation', { length: 100 }).notNull(),
  role: varchar('role', { length: 2 }).notNull(), // SC | SJ | TA | FA
  site: varchar('site', { length: 255 }).notNull(),
  attending: varchar('attending', { length: 255 }).notNull(),
  patient_type: varchar('patient_type', { length: 20 }).notNull(), // adult | pediatric
  defined_category: varchar('defined_category', { length: 100 }),
  procedure_cpt: varchar('procedure_cpt', { length: 500 }),
  operative_autonomy: varchar('operative_autonomy', { length: 30 }),
  // 'show_and_tell' | 'active_assistance' | 'passive_help' | 'supervision_only' | 'solo'
  // Zwisch scale — resident self-reported, attending confirms via EPA
  involved_trauma: boolean('involved_trauma').default(false),
  comments: text('comments'),
  source: varchar('source', { length: 20 }).notNull().default('manual'),
  // 'manual' | 'csv_import' | 'fhir_auto'
  is_complete: boolean('is_complete').default(true),
  // false = quick-log (incomplete record to be finished later)
  user_id: uuid('user_id').references(() => users.id).notNull(),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

### attending_feedback
**DEPRECATED.** Replaced by `epa_assessments` table. Kept for backward compatibility with prior prototype code.
```typescript
export const attendingFeedback = pgTable('attending_feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  case_log_id: uuid('case_log_id').references(() => caseLogs.id).notNull(),
  autonomy_level: integer('autonomy_level').notNull(), // 1-5 Likert
  case_complexity: integer('case_complexity').notNull(), // 1-5 Likert
  teaching_value: integer('teaching_value').notNull(), // 1-5 Likert
  comments: text('comments'),
  submitted_by: uuid('submitted_by').references(() => users.id).notNull(),
  // attending who submitted the feedback
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueFeedback: unique().on(table.case_log_id),
}));
```

### bedside_procedures
```typescript
export const bedsideProcedures = pgTable('bedside_procedures', {
  id: uuid('id').primaryKey().defaultRandom(),
  procedure_type: varchar('procedure_type', { length: 100 }).notNull(),
  // 'central_line_ij' | 'central_line_sc' | 'central_line_femoral' | 'arterial_line_radial' |
  // 'arterial_line_femoral' | 'chest_tube' | 'thoracentesis' | 'paracentesis' |
  // 'wound_vac' | 'abscess_id' | 'tracheostomy_care' | 'gj_tube' | 'drain_management'
  site_laterality: varchar('site_laterality', { length: 10 }),
  // 'right' | 'left' | 'na'
  ultrasound_guided: boolean('ultrasound_guided').default(false),
  supervision: varchar('supervision', { length: 20 }).notNull(),
  // 'supervised' | 'independent'
  complications: varchar('complications', { length: 10 }).notNull().default('none'),
  // 'none' | 'minor' | 'major'
  procedure_date: date('procedure_date').notNull(),
  attending: varchar('attending', { length: 255 }),
  rotation: varchar('rotation', { length: 100 }),
  comments: text('comments'),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

## EPA & Assessment Tables

### epa_requests
```typescript
export const epaRequests = pgTable('epa_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  case_log_id: uuid('case_log_id').references(() => caseLogs.id).notNull(),
  attending_email: varchar('attending_email', { length: 255 }).notNull(),
  attending_name: varchar('attending_name', { length: 255 }).notNull(),
  magic_token: varchar('magic_token', { length: 255 }).unique().notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  // 'pending' | 'sent' | 'received' | 'expired'
  sent_at: timestamp('sent_at'),
  completed_at: timestamp('completed_at'),
  expires_at: timestamp('expires_at').notNull(), // 72-hour expiry
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

### epa_assessments
```typescript
export const epaAssessments = pgTable('epa_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  epa_request_id: uuid('epa_request_id').references(() => epaRequests.id).notNull(),
  case_log_id: uuid('case_log_id').references(() => caseLogs.id).notNull(),
  // ABS EPA 1-5 entrustment scale per phase
  preop_score: integer('preop_score'), // 1-5
  intraop_score: integer('intraop_score'), // 1-5
  postop_score: integer('postop_score'), // 1-5
  // Attending confirms/adjusts Zwisch autonomy
  confirmed_autonomy: varchar('confirmed_autonomy', { length: 30 }),
  // 'show_and_tell' | 'active_assistance' | 'passive_help' | 'supervision_only' | 'solo'
  comments: text('comments'),
  submitted_by: uuid('submitted_by').references(() => users.id).notNull(),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

## Versioning Tables

### guideline_versions
Phase 2: Every edit creates a version record.
```typescript
export const guidelineVersions = pgTable('guideline_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  guideline_id: uuid('guideline_id').references(() => guidelines.id).notNull(),
  version_number: integer('version_number').notNull(),
  content_snapshot: text('content_snapshot'),
  pdf_url: text('pdf_url'), // R2 URL for this version's PDF
  change_summary: text('change_summary'),
  authored_by: uuid('authored_by').references(() => users.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueVersion: unique().on(table.guideline_id, table.version_number),
}));
```

## Resident Tracking Tables

### rotations
```typescript
export const rotations = pgTable('rotations', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  rotation_name: varchar('rotation_name', { length: 100 }).notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userDate: unique().on(table.user_id, table.start_date),
}));
```

### fellowship_goals
```typescript
export const fellowshipGoals = pgTable('fellowship_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  fellowship_name: varchar('fellowship_name', { length: 100 }).notNull(),
  // e.g. 'Colorectal Surgery', 'HPB', 'MIS/Bariatric', etc.
  target_apply_date: date('target_apply_date'),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueGoal: unique().on(table.user_id, table.fellowship_name),
}));
```

### publications
```typescript
export const publications = pgTable('publications', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  orcid_work_id: varchar('orcid_work_id', { length: 100 }),
  pmid: varchar('pmid', { length: 20 }), // PubMed ID
  title: text('title').notNull(),
  journal: varchar('journal', { length: 255 }),
  publication_date: date('publication_date'),
  is_first_author: boolean('is_first_author').default(false),
  citation_count: integer('citation_count').default(0),
  impact_factor: real('impact_factor'),
  doi: varchar('doi', { length: 255 }),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  synced_at: timestamp('synced_at').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

## Wellness Tables

### wellness_checkins
```typescript
export const wellnessCheckins = pgTable('wellness_checkins', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  checkin_date: date('checkin_date').notNull(),
  sleep_hours: real('sleep_hours'),
  mood_score: integer('mood_score'), // 1-10
  stress_score: integer('stress_score'), // 1-10
  exercise_minutes: integer('exercise_minutes'),
  // Validated instruments (scored per standard)
  phq9_score: integer('phq9_score'), // 0-27
  gad7_score: integer('gad7_score'), // 0-21
  epworth_score: integer('epworth_score'), // 0-24
  phq9_item9_flagged: boolean('phq9_item9_flagged').default(false),
  // Crisis flag — Item 9 response > 0
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  weeklyUnique: unique().on(table.user_id, table.checkin_date),
}));
```

## Integration Tables

### on_call_assignments
```typescript
export const onCallAssignments = pgTable('on_call_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  provider_name: varchar('provider_name', { length: 255 }).notNull(),
  provider_email: varchar('provider_email', { length: 255 }),
  provider_phone: varchar('provider_phone', { length: 50 }),
  provider_pager: varchar('provider_pager', { length: 50 }),
  service: varchar('service', { length: 100 }).notNull(),
  shift_start: timestamp('shift_start').notNull(),
  shift_end: timestamp('shift_end').notNull(),
  qgenda_task_id: varchar('qgenda_task_id', { length: 100 }),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  synced_at: timestamp('synced_at').defaultNow().notNull(),
});
```

### conference_deadlines
**NOTE:** This is a global table, not tenant-scoped. Same deadlines for all programs.
```typescript
export const conferenceDeadlines = pgTable('conference_deadlines', {
  id: uuid('id').primaryKey().defaultRandom(),
  conference_name: varchar('conference_name', { length: 255 }).notNull(),
  society: varchar('society', { length: 100 }).notNull(),
  fellowship_target: varchar('fellowship_target', { length: 100 }),
  // which fellowship this conference is relevant to
  deadline_date: date('deadline_date'),
  submission_url: text('submission_url'),
  typical_month: varchar('typical_month', { length: 20 }),
  // fallback when exact date not yet scraped
  last_scraped_at: timestamp('last_scraped_at'),
  is_community_corrected: boolean('is_community_corrected').default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

### podcast_episodes
**NOTE:** Global table, not tenant-scoped. Same episodes for all programs.
```typescript
export const podcastEpisodes = pgTable('podcast_episodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  source: varchar('source', { length: 50 }).notNull(),
  // 'btk' | 'surgeons_cut' | 'surgonc_today' | 'ssat' | 'trauma_voice'
  title: text('title').notNull(),
  description: text('description'),
  audio_url: text('audio_url'),
  published_at: timestamp('published_at'),
  specialty_tags: text('specialty_tags').array(),
  duration_seconds: integer('duration_seconds'),
  external_id: varchar('external_id', { length: 255 }),
  synced_at: timestamp('synced_at').defaultNow().notNull(),
});
```

## Compliance Tables

### audit_logs
Phase 2: Immutable append-only log. Required for HIPAA compliance.
```typescript
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id),
  tenant_id: uuid('tenant_id').references(() => hospitals.id).notNull(),
  action: varchar('action', { length: 50 }).notNull(),
  // 'guideline.read' | 'guideline.create' | 'guideline.update' | 'guideline.delete'
  // 'caselog.create' | 'caselog.update' | 'directory.read' | 'user.login' | etc.
  resource_type: varchar('resource_type', { length: 50 }),
  resource_id: uuid('resource_id'),
  metadata: jsonb('metadata'), // additional context (IP, user agent, etc.)
  ip_address: varchar('ip_address', { length: 45 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
// NOTE: No UPDATE or DELETE operations should ever be performed on this table.
// Application layer should only INSERT. Consider a database trigger to prevent mutations.
```

## Indexes

```sql
-- Core lookups
CREATE INDEX idx_guidelines_hospital ON guidelines(hospital_id);
CREATE INDEX idx_contacts_hospital ON contacts(hospital_id, service);
CREATE INDEX idx_guidelines_specialty ON guidelines(hospital_id, specialty);
CREATE INDEX idx_guidelines_status ON guidelines(hospital_id, status);
CREATE INDEX idx_case_logs_user ON case_logs(user_id);
CREATE INDEX idx_case_logs_hospital ON case_logs(hospital_id);
CREATE INDEX idx_case_logs_attending ON case_logs(user_id, attending);
CREATE INDEX idx_case_logs_category ON case_logs(user_id, defined_category);
CREATE INDEX idx_case_logs_date ON case_logs(user_id, case_date DESC);
CREATE INDEX idx_users_hospital ON users(hospital_id);

-- EPA tracking
CREATE INDEX idx_epa_requests_case ON epa_requests(case_log_id);
CREATE INDEX idx_epa_requests_status ON epa_requests(hospital_id, status);
CREATE INDEX idx_epa_assessments_case ON epa_assessments(case_log_id);

-- Bedside procedures
CREATE INDEX idx_bedside_user ON bedside_procedures(user_id);
CREATE INDEX idx_bedside_hospital ON bedside_procedures(hospital_id);

-- Rotations
CREATE INDEX idx_rotations_user ON rotations(user_id, start_date DESC);
CREATE INDEX idx_rotations_current ON rotations(user_id, start_date, end_date);

-- Fellowship
CREATE INDEX idx_fellowship_user ON fellowship_goals(user_id);

-- Publications
CREATE INDEX idx_publications_user ON publications(user_id);
CREATE INDEX idx_publications_date ON publications(user_id, publication_date DESC);

-- On-call
CREATE INDEX idx_oncall_hospital ON on_call_assignments(hospital_id, shift_start, shift_end);
CREATE INDEX idx_oncall_service ON on_call_assignments(hospital_id, service, shift_start);

-- Wellness
CREATE INDEX idx_wellness_user ON wellness_checkins(user_id, checkin_date DESC);

-- Podcast (global)
CREATE INDEX idx_podcast_specialty ON podcast_episodes USING gin(specialty_tags);
CREATE INDEX idx_podcast_source ON podcast_episodes(source, published_at DESC);

-- Audit log (high-volume, append-only)
CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Phase 2: Full-text search
-- CREATE INDEX idx_guidelines_search ON guidelines USING gin(search_vector);

-- Phase 3: Semantic search
-- CREATE INDEX idx_guidelines_embedding ON guidelines USING ivfflat(embedding vector_cosine_ops);
```

## Row-Level Security

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE epa_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE epa_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bedside_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE rotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellowship_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE on_call_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_checkins ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see data from their tenant
CREATE POLICY tenant_isolation ON guidelines
  USING (hospital_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation ON case_logs
  USING (hospital_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation ON users
  USING (hospital_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation ON epa_requests
  USING (hospital_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation ON epa_assessments
  USING (hospital_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation ON bedside_procedures
  USING (hospital_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation ON rotations
  USING (hospital_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation ON fellowship_goals
  USING (hospital_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation ON publications
  USING (hospital_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation ON on_call_assignments
  USING (hospital_id = current_setting('app.tenant_id')::uuid);

CREATE POLICY tenant_isolation ON wellness_checkins
  USING (hospital_id = current_setting('app.tenant_id')::uuid);

-- NOTE: conference_deadlines and podcast_episodes are GLOBAL tables — no RLS needed.

-- Each API call must SET LOCAL app.tenant_id = $1 before queries
```
