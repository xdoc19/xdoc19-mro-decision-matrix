import React, { useState } from 'react'
import { AI_SUPPLIERS } from '../data/constants.js'
import { Panel, PanelTitle, Grid, FieldGroup, Actions, Btn, AiBox, ScoreBadge } from './UI.jsx'

const DEFAULT_SUPPLIERS = [
  { id: 's1', name: 'Hydac International', country: 'DE', price: 82000, tech: 8.5, delivery: 9, quality: 9, financial: '42M EUR', refs: 3, legalOk: true, isoOk: true, gdprOk: true, rating: 'A', age: 32, risk: 'Scăzut' },
  { id: 's2', name: 'Parker Hannifin',     country: 'US', price: 88500, tech: 9.0, delivery: 8, quality: 9, financial: '14B USD', refs: 5, legalOk: true, isoOk: false, gdprOk: true, rating: 'A+', age: 85, risk: 'Scăzut' },
  { id: 's3', name: 'Donaldson Co.',       country: 'US', price: 76000, tech: 7.5, delivery: 7, quality: 8, financial: '2.8B USD', refs: 4, legalOk: true, isoOk: true, gdprOk: false, rating: 'BBB+', age: 67, risk: 'Moderat' },
]

export default function StepRFQ({ project, onChange, onNext, onBack }) {
  const [newSupplier, setNewSupplier] = useState('')
  const rfq = project.rfq || {}
  const suppliers = project.suppliers?.length ? project.suppliers : DEFAULT_SUPPLIERS
  const selected = project.selectedSuppliers || suppliers.map(s => s.id)
  const aiSuppliers = AI_SUPPLIERS[project.category] || AI_SUPPLIERS['Altele']

  const updateRfq = (key, val) => onChange({ rfq: { ...rfq, [key]: val } })

  const toggleSupplier = (id) => {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]
    onChange({ selectedSuppliers: next })
  }

  const addSupplier = () => {
    if (!newSupplier.trim()) return
    const s = { id: `s${Date.now()}`, name: newSupplier.trim(), country: '—', price: 0, tech: 0, delivery: 0, quality: 0, financial: '—', refs: 0, legalOk: null, isoOk: null, gdprOk: null, rating: '—', age: 0, risk: '—' }
    onChange({ suppliers: [...suppliers, s] })
    setNewSupplier('')
  }

  return (
    <div>
      <Grid cols={2} style={{ alignItems: 'start' }}>
        {/* LEFT — template */}
        <Panel>
          <PanelTitle>Template RFQ</PanelTitle>
          <FieldGroup label="Subiect RFQ">
            <input type="text" value={rfq.subject || `RFQ — ${project.name}`} onChange={e => updateRfq('subject', e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Termen limită ofertă">
            <input type="text" value={rfq.deadline || ''} onChange={e => updateRfq('deadline', e.target.value)} placeholder="ex: 14 zile de la trimitere" />
          </FieldGroup>
          <FieldGroup label="Cerințe incluse în RFQ">
            <textarea
              style={{ minHeight: 100 }}
              value={rfq.requirements || ''}
              onChange={e => updateRfq('requirements', e.target.value)}
              placeholder="Specificații tehnice, cantități, condiții livrare, certificări solicitate, format ofertă..."
            />
          </FieldGroup>
          <Grid cols={2}>
            <FieldGroup label="Incoterms">
              <select value={rfq.incoterms || 'DAP'} onChange={e => updateRfq('incoterms', e.target.value)}>
                {['EXW','FCA','CPT','CIP','DAP','DDP'].map(t => <option key={t}>{t}</option>)}
              </select>
            </FieldGroup>
            <FieldGroup label="Termene plată">
              <select value={rfq.payment || '30 zile net'} onChange={e => updateRfq('payment', e.target.value)}>
                {['30 zile net','45 zile net','60 zile net','90 zile net'].map(t => <option key={t}>{t}</option>)}
              </select>
            </FieldGroup>
          </Grid>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Btn size="sm" variant="secondary" onClick={() => window.open(`https://claude.ai/new?q=${encodeURIComponent(`Generează un template RFQ complet pentru achiziția de ${project.category} MRO în industria automotive, valoare ${project.value} EUR`)}`, '_blank')}>
              Generare AI ↗
            </Btn>
            <Btn size="sm" variant="primary">Previzualizare RFQ</Btn>
          </div>
        </Panel>

        {/* RIGHT — suppliers */}
        <div>
          <Panel>
            <PanelTitle>Furnizori identificați</PanelTitle>
            {suppliers.map(s => (
              <div key={s.id} style={{
                border: '0.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px', marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 10,
                opacity: selected.includes(s.id) ? 1 : 0.5,
              }}>
                <ScoreBadge value={s.tech} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{s.country} · CA: {s.financial}</div>
                </div>
                <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSupplier(s.id)} />
              </div>
            ))}

            <AiBox title="Adaugă furnizori sugerați de AI">
              {aiSuppliers.slice(3).map((name, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--blue-800)', padding: '3px 0' }}>
                  <span style={{ color: 'var(--blue-600)' }}>+</span> {name}
                </div>
              ))}
            </AiBox>

            <div style={{ marginTop: 12 }}>
              <FieldGroup label="Furnizor nou (manual)">
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" value={newSupplier} onChange={e => setNewSupplier(e.target.value)} placeholder="Denumire furnizor..." onKeyDown={e => e.key === 'Enter' && addSupplier()} />
                  <Btn size="sm" variant="secondary" onClick={addSupplier}>Adaugă</Btn>
                </div>
              </FieldGroup>
            </div>
          </Panel>

          <Panel>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
              RFQ va fi trimis la <strong>{selected.length}</strong> furnizori selectați.
            </p>
            <Actions>
              <Btn variant="secondary" onClick={onBack}>← Înapoi colectare</Btn>
              <Btn variant="primary" onClick={onNext}>Trimite RFQ →</Btn>
            </Actions>
          </Panel>
        </div>
      </Grid>
    </div>
  )
}
