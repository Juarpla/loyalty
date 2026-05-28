import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'

describe('DbMigrationCompanyWifi Integration Tests', () => {
  it('R1, R2, R6: should create companies table with correct columns and types', () => {
    const columnsQuery = `
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'companies';
    `
    const outputCols = execSync(`pnpm exec supabase db query -o json "${columnsQuery.replace(/\n/g, ' ')}"`, { encoding: 'utf-8' })

    expect(outputCols).toContain('"column_name": "id"')
    expect(outputCols).toContain('"data_type": "uuid"')
    
    expect(outputCols).toContain('"column_name": "name"')
    expect(outputCols).toContain('"data_type": "text"')
    expect(outputCols).toContain('"is_nullable": "NO"')

    expect(outputCols).toContain('"column_name": "created_at"')
    expect(outputCols).toContain('"data_type": "timestamp with time zone"')
  })

  it('R1, R3, R6: should create company_wifi_settings table with correct columns, types, and defaults', () => {
    const columnsQuery = `
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'company_wifi_settings';
    `
    const outputCols = execSync(`pnpm exec supabase db query -o json "${columnsQuery.replace(/\n/g, ' ')}"`, { encoding: 'utf-8' })

    expect(outputCols).toContain('"column_name": "id"')
    expect(outputCols).toContain('"data_type": "uuid"')

    expect(outputCols).toContain('"column_name": "company_id"')
    expect(outputCols).toContain('"data_type": "uuid"')
    expect(outputCols).toContain('"is_nullable": "NO"')

    expect(outputCols).toContain('"column_name": "ssid"')
    expect(outputCols).toContain('"data_type": "text"')
    expect(outputCols).toContain('"is_nullable": "NO"')

    expect(outputCols).toContain('"column_name": "wifi_password"')
    expect(outputCols).toContain('"data_type": "text"')
    expect(outputCols).toContain('"is_nullable": "NO"')

    expect(outputCols).toContain('"column_name": "welcome_title"')
    expect(outputCols).toContain('"data_type": "text"')
    expect(outputCols).toContain('"is_nullable": "NO"')
    expect(outputCols).toContain("'Welcome to our WiFi'::text")

    expect(outputCols).toContain('"column_name": "welcome_message"')
    expect(outputCols).toContain('"data_type": "text"')
    expect(outputCols).toContain('"is_nullable": "NO"')
    expect(outputCols).toContain("'Please sign in to connect'::text")

    expect(outputCols).toContain('"column_name": "brand_color"')
    expect(outputCols).toContain('"data_type": "text"')
    expect(outputCols).toContain('"is_nullable": "NO"')
    expect(outputCols).toContain("'#000000'::text")

    expect(outputCols).toContain('"column_name": "created_at"')
    expect(outputCols).toContain('"data_type": "timestamp with time zone"')
  })

  it('R4, R6: should enforce a foreign key reference from company_wifi_settings.company_id to companies.id with ON DELETE CASCADE', () => {
    const fkQuery = `
      SELECT
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.delete_rule
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        JOIN information_schema.referential_constraints AS rc
          ON tc.constraint_name = rc.constraint_name
          AND tc.table_schema = rc.constraint_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='company_wifi_settings';
    `
    const outputFk = execSync(`pnpm exec supabase db query -o json "${fkQuery.replace(/\n/g, ' ')}"`, { encoding: 'utf-8' })

    expect(outputFk).toContain('"column_name": "company_id"')
    expect(outputFk).toContain('"foreign_table_name": "companies"')
    expect(outputFk).toContain('"foreign_column_name": "id"')
    expect(outputFk).toContain('"delete_rule": "CASCADE"')
  })

  it('R5, R6: should enforce a unique index/constraint on company_wifi_settings.company_id column', () => {
    const uniqueQuery = `
      SELECT indexdef 
      FROM pg_indexes 
      WHERE tablename = 'company_wifi_settings' AND indexdef LIKE '%UNIQUE%company_id%';
    `
    const outputUnique = execSync(`pnpm exec supabase db query -o json "${uniqueQuery.replace(/\n/g, ' ')}"`, { encoding: 'utf-8' })

    expect(outputUnique).toContain('UNIQUE')
    expect(outputUnique).toContain('company_id')
  })
})
