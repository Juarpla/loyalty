import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'

describe('DbMigrationCaptiveClients Integration Tests', () => {
  it('R1, R2: should create clients table with correct columns and b-tree index', () => {
    // R1 & R2: Check columns
    const columnsQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'clients';
    `
    const outputCols = execSync(`pnpm exec supabase db query -o json "${columnsQuery.replace(/\n/g, ' ')}"`, { encoding: 'utf-8' })
    
    expect(outputCols).toContain('"column_name": "id"')
    expect(outputCols).toContain('"data_type": "uuid"')
    expect(outputCols).toContain('"column_name": "phone_number"')
    expect(outputCols).toContain('"data_type": "text"')
    expect(outputCols).toContain('"column_name": "name"')
    expect(outputCols).toContain('"column_name": "created_at"')
    expect(outputCols).toContain('"data_type": "timestamp with time zone"')
    
    // Check Unique / B-Tree index on phone_number
    const indexQuery = `
      SELECT indexdef 
      FROM pg_indexes 
      WHERE tablename = 'clients' AND indexname = 'clients_phone_number_key';
    `
    const outputIdx = execSync(`pnpm exec supabase db query -o json "${indexQuery.replace(/\n/g, ' ')}"`, { encoding: 'utf-8' })
    
    expect(outputIdx).toContain('btree (phone_number)')
    expect(outputIdx).toContain('UNIQUE')
  })

  it('R1, R3, R4: should create wifi_logins table with correct columns and foreign key', () => {
    // R1 & R3: Check columns
    const columnsQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'wifi_logins';
    `
    const outputCols = execSync(`pnpm exec supabase db query -o json "${columnsQuery.replace(/\n/g, ' ')}"`, { encoding: 'utf-8' })
    
    expect(outputCols).toContain('"column_name": "id"')
    expect(outputCols).toContain('"data_type": "uuid"')
    expect(outputCols).toContain('"column_name": "client_id"')
    expect(outputCols).toContain('"data_type": "uuid"')
    expect(outputCols).toContain('"column_name": "created_at"')
    expect(outputCols).toContain('"data_type": "timestamp with time zone"')
    
    // R4: Check foreign key
    const fkQuery = `
      SELECT
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='wifi_logins';
    `
    const outputFk = execSync(`pnpm exec supabase db query -o json "${fkQuery.replace(/\n/g, ' ')}"`, { encoding: 'utf-8' })
    
    expect(outputFk).toContain('"column_name": "client_id"')
    expect(outputFk).toContain('"foreign_table_name": "clients"')
    expect(outputFk).toContain('"foreign_column_name": "id"')
  })
})
