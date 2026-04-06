import React from 'react'
import { EVALUATION_CRITERIA } from '../data/constants.js'
import { Panel, PanelTitle, Grid, FieldGroup, Actions, Btn } from './UI.jsx'

const DEFAULT_SUPPLIERS = [
  { id: 's1', name: 'Hydac International', country: 'DE', price: 82000, tech: 8.5, delivery: 9, quality: 9, financial: '42M EUR', refs: 3, rating: 'A', risk: 'Scăzut' },
  { id: 's2', name: 'Parker Hannifin',     country: 'US', price: 88500, tech: 9.0, delivery: 8, quality: 9, financial: '14B USD', refs: 5, rating: 'A+', risk: 'Scăzut' },
  { id: 's3', name: 'Donaldson Co.',       country: 'US', price: 76000, tech: 7.5, delivery: 7, quality: 8, financial: '2.8B USD', refs: 4, rating: 'BBB+', risk: 'Moderat' },
]
const DEFAULT_SCORES = {
  s1: { price: 9, tech: 8.5, delivery: 9, financial: 9, refs: 8 },
  s2: { price: 7, tech: 9.0, delivery: 8, financial: 9, refs: 9 },
  s3: { price: 10, tech: 7.5, delivery: 7, financial: 8, refs: 8 },
}

const ACTION_ITEMS = [
  'Emitere comandă de achiziție (PO)',
  'Notificare furnizori necâștigători',
  'Arhivare documentație RFQ completă',
  'Setare reminder evaluare performanță 12 luni',
  'Actualizare baza de date furnizori aprobați',
]

export default function StepDecision({ project, onChange, onBack, onFinish }) {
  const suppliers = project.suppliers?.length ? project.suppliers : DEFAULT_SUPPLIERS
  const scores = project.scores && Object.keys(project.scores).length ? project.scores : DEFAULT_SCORES
  const decision = project.decision || {}
  const actions = project.actionItems || {}

  const getTotal = (sid) => EVALUATION_CRITERIA.reduce((sum, c) => sum + c.weight * ((scores[sid]?.[c.id]) || 0), 0)
  const bestId = suppliers.reduce((a, b) => getTotal(a.id) > getTotal(b.id) ? a : b, suppliers[0])?.id
  const best = suppliers.find(s => s.id === bestId) || suppliers[0]
  const bestScore = getTotal(bestId)

  const updateDecision = (key, val) => onChange({ decision: { ...decision, [key]: val } })
  const toggleAction = (i) => onChange({ actionItems: { ...actions, [i]: !actions[i] } })

  const summaryRows = [
    ['Furnizor câștigător',  best.name],
    ['Preț final',           `${best.price.toLocaleString()} EUR`],
    ['Scor ponderat total',  `${bestScore.toFixed(2)} / 10`],
    ['Scor tehnic',          `${best.tech} / 10`],
    ['Lead time',            `${best.delivery} zile`],
    ['Referințe verificate', `${best.refs} parteneri`],
    ['Status legal',         'Conform'],
    ['Rating financiar',     `${best.rating} · Risc ${best.risk.toLowerCase()}`],
  ]

  return (
    <div>
      {/* Winner banner */}
      <div style={{
        background: 'var(--green-50)', border: '0.5px solid var(--green-100)',
        borderRadius: 'var(--radius-lg)', padding: '1.25rem',
        textAlign: 'center', marginBottom: '1rem',
      }}>
        <div style={{ fontSize: 12, color: 'var(--green-600)', fontWeight: 500, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Recomandare finală — Sourcing decision
        </div>
        <div style={{ fontSize: 24, fontWeight: 500, color: 'var(--green-800)' }}>{best.name}</div>
        <div style={{ fontSize: 13, color: 'var(--green-600)', marginTop: 4 }}>
          {best.price.toLocaleString()} EUR · Scor ponderat: {bestScore.toFixed(2)}/10
        </div>
      </div>

      <Grid cols={2} style={{ alignItems: 'start' }}>
        {/* Summary */}
        <Panel>
          <PanelTitle>Sumar decizie</PanelTitle>
          {summaryRows.map(([k, v]) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between', fontSize: 13,
              padding: '6px 0', borderBottom: '0.5px solid var(--color-border)',
            }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>{k}</span>
              <span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </Panel>

        {/* Approval + actions */}
        <div>
          <Panel>
            <PanelTitle>Aprobare decizie</PanelTitle>
            <FieldGroup label="Aprobat de">
              <input type="text" value={decision.approvedBy || ''} onChange={e => updateDecision('approvedBy', e.target.value)} placeholder="Nume, funcție..." />
            </FieldGroup>
            <FieldGroup label="Data deciziei">
              <input type="date" value={decision.date || ''} onChange={e => updateDecision('date', e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Observații finale">
              <textarea value={decision.notes || ''} onChange={e => updateDecision('notes', e.target.value)} placeholder="Note suplimentare, condiții speciale negociate..." />
            </FieldGroup>
          </Panel>

          <Panel>
            <PanelTitle>Acțiuni următoare</PanelTitle>
            {ACTION_ITEMS.map((item, i) => (
              <div
                key={i}
                onClick={() => toggleAction(i)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: 8, borderRadius: 'var(--radius-md)', marginBottom: 6,
                  border: `0.5px solid ${actions[i] ? '#9FE1CB' : 'var(--color-border)'}`,
                  background: actions[i] ? 'var(--teal-50)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <input type="checkbox" checked={!!actions[i]} onChange={() => toggleAction(i)} onClick={e => e.stopPropagation()} style={{ marginTop: 1 }} />
                <span style={{ fontSize: 13, color: actions[i] ? 'var(--teal-600)' : 'var(--color-text-primary)' }}>{item}</span>
              </div>
            ))}
          </Panel>
        </div>
      </Grid>

      <Panel>
        <Actions>
          <Btn variant="secondary" onClick={onBack}>← Business Case</Btn>
          <Btn variant="secondary" onClick={() => window.open(`https://claude.ai/new?q=${encodeURIComponent(`Generează un raport executiv de sourcing decision pentru proiectul "${project.name}" cu furnizorul câștigător ${best.name}, preț ${best.price.toLocaleString()} EUR, scor ${bestScore.toFixed(2)}/10.`)}`, '_blank')}>
            Export raport AI ↗
          </Btn>
          <Btn variant="primary" onClick={onFinish}>Finalizează proiect</Btn>
        </Actions>
      </Panel>
    </div>
  )
}
