import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const migrationSql = readFileSync(
  join(process.cwd(), 'supabase/migrations/20260528000000_company_wifi_schema.sql'),
  'utf-8',
).toLowerCase()

describe('DbMigrationCompanyWifi Integration Tests', () => {
  it('R1, R2, R6: should create companies table with correct columns and types', () => {
    expect(migrationSql).toContain('create table companies')
    expect(migrationSql).toContain('id uuid primary key')
    expect(migrationSql).toContain('name text not null')
    expect(migrationSql).toContain('created_at timestamptz default now()')
  })

  it('R1, R3, R6: should create company_wifi_settings table with correct columns, types, and defaults', () => {
    expect(migrationSql).toContain('create table company_wifi_settings')
    expect(migrationSql).toContain('id uuid primary key')
    expect(migrationSql).toContain('company_id uuid unique not null')
    expect(migrationSql).toContain('ssid text not null')
    expect(migrationSql).toContain('wifi_password text not null')
    expect(migrationSql).toContain("welcome_title text not null default 'welcome to our wifi'")
    expect(migrationSql).toContain("welcome_message text not null default 'please sign in to connect'")
    expect(migrationSql).toContain("brand_color text not null default '#000000'")
    expect(migrationSql).toContain('created_at timestamptz default now()')
  })

  it('R4, R6: should enforce a foreign key reference from company_wifi_settings.company_id to companies.id with ON DELETE CASCADE', () => {
    expect(migrationSql).toContain('company_id uuid unique not null references companies(id) on delete cascade')
  })

  it('R5, R6: should enforce a unique index/constraint on company_wifi_settings.company_id column', () => {
    expect(migrationSql).toContain('company_id uuid unique not null')
  })
})
