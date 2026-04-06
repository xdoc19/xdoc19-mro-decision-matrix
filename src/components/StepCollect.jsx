import React, { useState } from 'react'
import { CHECKLIST_ITEMS, AI_SUPPLIERS } from '../data/constants.js'
import {
  Panel, PanelTitle, Grid, FieldGroup, Actions, Btn, AiBox, NavBack
} from './UI.jsx'

export default function StepCollect({ project, onChange, onNext }) {
  const [emailTo, setEmailTo] = useState('')
  const [emailMsg, setEmailMsg] = useState('')
  const checklist = project.checklist || {}
  const specs = project.specs || {}
  const done = Object.values(checklist).filter(Boolean).length
  const total = CHECKLIST_ITEMS.length
  const pct = Math.round((done / total) * 100)
  const aiSuppliers = AI_SUPPLIERS[project.category] || AI_SUPPLIERS['Altele']

  const toggleCheck = (i) => {
    onChange({ checklist: { ...checklist, [i]: !checklist[i] } })
  }

  const updateSpec = (key, val) => {
    onChange({ specs: { ...specs, [key]: val } })
  }

  return (
    <div>
      <Grid cols={2} style={{ alignItems: 'start' }}>
        {/* LEFT — checklist */}
        <Panel>
          <PanelTitle>
            Checklist informații necesare
            <span style={{
              marginLeft: 'auto', fontSize: 11, padding: '3px 8px',
              borderRadius: 'var(--radius-md)', fontWeight: 500,
              background: pct === 100 ? 'var(--green-50)' : 'var(--blue-50)',
              color: pct === 100 ? 'var(--green-800)' : 'var(--blue-800)',
            }}>
              {done}/{total}
            </span>
          </PanelTitle>

          {/* progress mini */}
          <div style={{ height: 4, borderRadius: 2, background: 'var(--color-bg-secondary)', overflow: 'hidden', marginBottom: 12 }}>
            <div style={{
              height: '100%', borderRadius: 2, width: `${pct}%`,
              background: pct === 100 ? '#1D9E75' : 'var(--blue-600)',
              transition: 'width 0.3s',
            }} />
          </div>

          {CHECKLIST_ITEMS.map((item, i) => (
            <div
              key={i}
              onClick={() => toggleCheck(i)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: 8, borderRadius: 'var(--radius-md)', marginBottom: 6,
                border: `0.5px solid ${checklist[i] ? '#9FE1CB' : 'var(--color-border)'}`,
                background: checklist[i] ? 'var(--teal-50)' : 'transparent',
                cursor: 'pointer', transition: 'all 0.1s',
              }}
            >
              <input
                type="checkbox"
                checked={!!checklist[i]}
                onChange={() => toggleCheck(i)}
                onClick={e => e.stopPropagation()}
                style={{ marginTop: 1, flexShrink: 0 }}
              />
              <span style={{
                fontSize: 13,
                color: checklist[i] ? 'var(--teal-600)' : 'var(--color-text-primary)',
              }}>
                {item}
              </span>
            </div>
          ))}
        </Panel>

        {/* RIGHT — specs + AI + email */}
        <div>
          <Panel>
            <PanelTitle>Date proiect</PanelTitle>
            <FieldGroup label="Specificații tehnice">
              <textarea
                value={specs.tech || ''}
                onChange={e => updateSpec('tech', e.target.value)}
                placeholder="Descrieți cerințele tehnice specifice..."
              />
            </FieldGroup>
            <FieldGroup label="Cantitate anuală estimată">
              <input type="text" value={specs.qty || ''} onChange={e => updateSpec('qty', e.target.value)} placeholder="ex: 1200 buc / an" />
            </FieldGroup>
            <Grid cols={2}>
              <FieldGroup label="Lead time maxim">
                <input type="text" value={specs.leadtime || ''} onChange={e => updateSpec('leadtime', e.target.value)} placeholder="ex: 10 zile" />
              </FieldGroup>
              <FieldGroup label="Standarde aplicabile">
                <input type="text" value={specs.standards || ''} onChange={e => updateSpec('standards', e.target.value)} placeholder="ex: ISO 3448" />
              </FieldGroup>
            </Grid>

            <AiBox title={`Furnizori sugerați de AI — ${project.category}`}>
              {aiSuppliers.map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--blue-800)', padding: '3px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--blue-600)', fontSize: 14 }}>◆</span> {s}
                </div>
              ))}
            </AiBox>
          </Panel>

          <Panel>
            <PanelTitle>Colectare info prin email intern</PanelTitle>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
              Trimite cerere de informații clienților interni
            </p>
            <FieldGroup label="Destinatari (email)">
              <input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} placeholder="john.doe@company.com, ..." />
            </FieldGroup>
            <FieldGroup label="Mesaj">
              <textarea
                value={emailMsg}
                onChange={e => setEmailMsg(e.target.value)}
                placeholder={`Vă rog să confirmați specificațiile pentru ${project.name}...`}
              />
            </FieldGroup>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Btn size="sm" variant="primary">Trimite email intern</Btn>
            </div>
          </Panel>
        </div>
      </Grid>

      <Panel>
        <Actions>
          <Btn variant="secondary" onClick={() => window.open(`https://claude.ai/new?q=${encodeURIComponent(`Ajută-mă să completez cerințele tehnice pentru un proiect MRO de ${project.category}`)}`, '_blank')}>
            Asistență AI ↗
          </Btn>
          <Btn variant="primary" onClick={onNext}>
            Continuă → Trimitere RFQ
          </Btn>
        </Actions>
      </Panel>
    </div>
  )
}
