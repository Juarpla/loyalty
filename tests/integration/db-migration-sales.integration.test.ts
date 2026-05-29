import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const migrationSql = readFileSync(
  join(process.cwd(), 'supabase/migrations/20260520083124_create_sales_transactions.sql'),
  'utf-8',
).toLowerCase()

describe('DbMigrationSales Integration Tests', () => {
  it('R1, R2, R3: should create sales_transactions table with correct columns and index', () => {
    expect(migrationSql).toContain('create table sales_transactions')
    expect(migrationSql).toContain('id uuid primary key')
    expect(migrationSql).toContain('phone_number text not null')
    expect(migrationSql).toContain('amount numeric not null')
    expect(migrationSql).toContain('created_at timestamp with time zone not null default now()')
    expect(migrationSql).toContain('create index sales_transactions_phone_number_idx')
    expect(migrationSql).toContain('using btree (phone_number)')
  })
})
