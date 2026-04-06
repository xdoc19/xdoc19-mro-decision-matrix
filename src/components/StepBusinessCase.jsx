import React from 'react'
import { BUSINESS_CASE_THRESHOLD } from '../data/constants.js'
import { Panel, PanelTitle, Grid, FieldGroup, Actions, Btn, WarnBox, AiBox } from './UI.jsx'

export default function StepBusinessCase({ project, onChange, onNext, onBack }) {
  const bc = project.businessCase || {}
  const needsBC = project.value >= BUSINESS_CASE_THRESHOLD

  const update = (key, val) => onChange({ businessCase: { ...bc, [key]: val } })

  const roi = bc.investment > 0 ? Math.round(((bc.savings - bc.investment) / bc.investment) * 100) : 0
  const payback = bc.savings > 0 ? Math.round((bc.investment / bc.savings) * 12) : 0

  return (
    <Panel>
      <PanelTitle>
        Business Case
        <span style={{
          marginLeft: 'auto', fontSize: 11, padding: '3px 8px',
          borderRadius: 'var(--radius-md)', fontWeight: 500,
          background: needsBC ? 'var(--blue-50)' : 'var(--green-50)',
          color: needsBC ? 'var(--blue-800)' : 'var(--green-800)',
        }}>
          {needsBC ? 'Necesar' : 'Opțional'}
        </span>
      </PanelTitle>

      {needsBC ? (
        <WarnBox title="Prag valoric depășit">
          Valoarea proiectului ({project.value.toLocaleString()} EUR) depășește pragul de {BUSINESS_CASE_THRESHOLD.toLocaleString()} EUR — Business Case obligatoriu.
        </WarnBox>
      ) : (
        <AiBox title={`Sub pragul de ${BUSINESS_CASE_THRESHOLD.toLocaleString()} EUR`}>
          <div style={{ fontSize: 12, color: 'var(--blue-800)' }}>
            Business Case opțional. Puteți continua direct la decizie dacă nu există cerințe interne specifice.
          </div>
        </AiBox>
      )}

      <div style={{ marginTop: '1rem' }}>
        <Grid cols={2}>
          <FieldGroup label="Economie anuală estimată (EUR)">
            <input type="number" value={bc.savings || ''} onChange={e => update('savings', parseFloat(e.target.value) || 0)} placeholder="0" />
          </FieldGroup>
          <FieldGroup label="Investiție inițială (EUR)">
            <input type="number" value={bc.investment || ''} onChange={e => update('investment', parseFloat(e.target.value) || 0)} placeholder="0" />
          </FieldGroup>
        </Grid>

        {/* Auto-computed KPIs */}
        {(bc.savings > 0 || bc.investment > 0) && (
          <Grid cols={2} gap={8} style={{ marginBottom: 12 }}>
            <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 500, color: roi >= 0 ? 'var(--green-800)' : 'var(--red-600)' }}>{roi}%</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>ROI calculat</div>
            </div>
            <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-text-primary)' }}>{payback} luni</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>Payback period</div>
            </div>
          </Grid>
        )}

        <FieldGroup label="Justificare business">
          <textarea
            style={{ minHeight: 80 }}
            value={bc.justification || ''}
            onChange={e => update('justification', e.target.value)}
            placeholder="Descrieți beneficiile calitative și cantitative ale acestei achiziții..."
          />
        </FieldGroup>
        <FieldGroup label="Riscuri identificate și măsuri de mitigare">
          <textarea
            value={bc.risks || ''}
            onChange={e => update('risks', e.target.value)}
            placeholder="Riscuri principale și măsuri de mitigare..."
          />
        </FieldGroup>

        <div style={{ marginTop: 8 }}>
          <Btn size="sm" variant="secondary" onClick={() => window.open(`https://claude.ai/new?q=${encodeURIComponent(`Generează un business case pentru achiziția de ${project.category} MRO în valoare de ${project.value.toLocaleString()} EUR. Estimare economie anuală: ${bc.savings || 0} EUR, investiție inițială: ${bc.investment || 0} EUR.`)}`, '_blank')}>
            Generare Business Case AI ↗
          </Btn>
        </div>
      </div>

      <Actions>
        <Btn variant="secondary" onClick={onBack}>← Înapoi la analiză</Btn>
        <Btn variant="primary" onClick={onNext}>Continuă → Decizie</Btn>
      </Actions>
    </Panel>
  )
}
