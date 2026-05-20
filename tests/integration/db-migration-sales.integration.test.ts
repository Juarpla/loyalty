import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'

describe('DbMigrationSales Integration Tests', () => {
  it('R1, R2, R3: should create sales_transactions table with correct columns and index', () => {
    // R1 & R2: Check columns
    const columnsQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'sales_transactions';
    `
    const outputCols = execSync(`npx supabase db query -o json "${columnsQuery.replace(/\n/g, ' ')}"`, { encoding: 'utf-8' })
    
    expect(outputCols).toContain('"column_name": "id"')
    expect(outputCols).toContain('"data_type": "uuid"')
    expect(outputCols).toContain('"column_name": "phone_number"')
    expect(outputCols).toContain('"data_type": "text"')
    expect(outputCols).toContain('"column_name": "amount"')
    expect(outputCols).toContain('"data_type": "numeric"')
    expect(outputCols).toContain('"column_name": "created_at"')
    expect(outputCols).toContain('"data_type": "timestamp with time zone"')
    
    // R3: Check B-Tree index on phone_number
    const indexQuery = `
      SELECT indexdef 
      FROM pg_indexes 
      WHERE tablename = 'sales_transactions' AND indexname = 'sales_transactions_phone_number_idx';
    `
    const outputIdx = execSync(`npx supabase db query -o json "${indexQuery.replace(/\n/g, ' ')}"`, { encoding: 'utf-8' })
    
    expect(outputIdx).toContain('btree (phone_number)')
  })
})
