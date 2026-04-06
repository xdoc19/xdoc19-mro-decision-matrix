import React, { useState } from 'react'
import { STEPS, MRO_CATEGORIES } from '../data/constants.js'
import { Panel, PanelTitle, Btn, Badge, Grid, FieldGroup } from './UI.jsx'

export default function ProjectList({ projects, onOpen, onCreate }) {
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'Filtrare', value: '', description: '' })

  const handleCreate = () => {
    if (!form.name.trim()) return
    onCreate({
      name: form.name.trim(),
      category: form.category,
      value: parseFloat(form.value) || 0,
      description: form.description,
      currency: 'EUR',
    })
    setCreating(false)
    setForm({ name: '', category: 'Filtrare', value: '', description: '' })
  }

  const stepBadgeVariant = (step) => {
    if (step >= 4) return 'green'
    if (step >= 2) return 'blue'
    return 'amber'
  }

  return (
    <div>
      {creating ? (
        <Panel>
          <PanelTitle>Proiect nou MRO</PanelTitle>
          <Grid cols={2}>
            <FieldGroup label="Denumire proiect">
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="ex: Filtre hidraulice presă H3..." autoFocus />
            </FieldGroup>
            <FieldGroup label="Categorie MRO">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {MRO_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </FieldGroup>
            <FieldGroup label="Valoare estimată (EUR)">
              <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="0" min="0" />
            </FieldGroup>
            <FieldGroup label="Descriere cerință">
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descrieți pe scurt necesarul..." />
            </FieldGroup>
          </Grid>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Btn variant="secondary" onClick={() => setCreating(false)}>Anulează</Btn>
            <Btn variant="primary" onClick={handleCreate}>Creează proiect</Btn>
          </div>
        </Panel>
      ) : (
        <Panel>
          <PanelTitle>
            Proiecte MRO active
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 400 }}>
              {projects.length} proiect{projects.length !== 1 ? 'e' : ''}
            </span>
            <Btn size="sm" variant="primary" onClick={() => setCreating(true)}>+ Proiect nou</Btn>
          </PanelTitle>

          {projects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: 14 }}>
              Nu există proiecte. Creați primul proiect MRO.
            </div>
          )}

          {projects.map(p => (
            <div
              key={p.id}
              onClick={() => onOpen(p.id)}
              style={{
                border: '0.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px', marginBottom: 8,
                cursor: 'pointer', transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-secondary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 12,
                      background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)',
                      border: '0.5px solid var(--color-border)', marginRight: 8,
                    }}>
                      {p.category}
                    </span>
                    {p.value.toLocaleString()} {p.currency}
                    {p.value >= 15000 && (
                      <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--blue-600)' }}>· Business Case requis</span>
                    )}
                  </div>
                </div>
                <Badge variant={stepBadgeVariant(p.step)}>{STEPS[p.step].label}</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--color-bg-secondary)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    background: p.step >= 4 ? '#1D9E75' : 'var(--blue-600)',
                    width: `${(p.step / (STEPS.length - 1)) * 100}%`,
                    transition: 'width 0.3s',
                  }} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                  Etapa {p.step + 1}/{STEPS.length}
                </span>
              </div>
            </div>
          ))}
        </Panel>
      )}
    </div>
  )
}
