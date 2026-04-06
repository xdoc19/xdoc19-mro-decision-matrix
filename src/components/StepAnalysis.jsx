import React, { useState } from 'react'
import { EVALUATION_CRITERIA } from '../data/constants.js'
import { Panel, PanelTitle, Grid, Actions, Btn, ScoreBadge, MetricCard, WarnBox, ScoreColor } from './UI.jsx'

const DEFAULT_SUPPLIERS = [
  { id: 's1', name: 'Hydac International', country: 'DE', price: 82000, tech: 8.5, delivery: 9, quality: 9, financial: '42M EUR', refs: 3, legalOk: true, isoOk: true, gdprOk: true, rating: 'A', age: 32, risk: 'Scăzut' },
  { id: 's2', name: 'Parker Hannifin',     country: 'US', price: 88500, tech: 9.0, delivery: 8, quality: 9, financial: '14B USD', refs: 5, legalOk: true, isoOk: false, gdprOk: true, rating: 'A+', age: 85, risk: 'Scăzut' },
  { id: 's3', name: 'Donaldson Co.',       country: 'US', price: 76000, tech: 7.5, delivery: 7, quality: 8, financial: '2.8B USD', refs: 4, legalOk: true, isoOk: true, gdprOk: false, rating: 'BBB+', age: 67, risk: 'Moderat' },
]

const DEFAULT_SCORES = {
  s1: { price: 9, tech: 8.5, delivery: 9, financial: 9, refs: 8 },
  s2: { price: 7, tech: 9.0, delivery: 8, financial: 9, refs: 9 },
  s3: { price: 10, tech: 7.5, delivery: 7, financial: 8, refs: 8 },
}

const TABS = ['Oferte primite', 'Matrice decizie', 'Verificare legală', 'Aspect financiar', 'Evaluare tehnică']

export default function StepAnalysis({ project, onChange, onNext, onBack }) {
  const [tab, setTab] = useState(project.activeTab || 0)
  const suppliers = project.suppliers?.length ? project.suppliers : DEFAULT_SUPPLIERS
  const scores = project.scores && Object.keys(project.scores).length ? project.scores : DEFAULT_SCORES

  const updateScore = (sid, criterion, val) => {
    onChange({ scores: { ...scores, [sid]: { ...scores[sid], [criterion]: parseFloat(val) || 0 } } })
  }

  // Weighted total
  const getTotal = (sid) => {
    const s = scores[sid] || {}
    return EVALUATION_CRITERIA.reduce((sum, c) => sum + (c.weight * (s[c.id] || 0)), 0)
  }
  const totals = Object.fromEntries(suppliers.map(s => [s.id, getTotal(s.id)]))
  const bestId = suppliers.reduce((a, b) => totals[a.id] > totals[b.id] ? a : b, suppliers[0])?.id

  const setTabAndSave = (i) => { setTab(i); onChange({ activeTab: i }) }

  return (
    <Panel>
      <PanelTitle>
        Analiză oferte
        <span style={{ marginLeft: 'auto', fontSize: 11, padding: '3px 8px', borderRadius: 'var(--radius-md)', fontWeight: 500, background: 'var(--amber-50)', color: 'var(--amber-800)' }}>
          Buclă analiză activă
        </span>
      </PanelTitle>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1rem', borderBottom: '0.5px solid var(--color-border)', paddingBottom: 0 }}>
        {TABS.map((t, i) => (
          <div key={i} onClick={() => setTabAndSave(i)} style={{
            fontSize: 13, padding: '6px 12px', cursor: 'pointer',
            color: tab === i ? 'var(--blue-600)' : 'var(--color-text-secondary)',
            borderBottom: tab === i ? '2px solid var(--blue-600)' : '2px solid transparent',
            marginBottom: -1, fontWeight: tab === i ? 500 : 400,
            whiteSpace: 'nowrap',
          }}>
            {t}
          </div>
        ))}
      </div>

      {tab === 0 && <OffersTab suppliers={suppliers} project={project} onBack={onBack} />}
      {tab === 1 && <MatrixTab suppliers={suppliers} scores={scores} totals={totals} bestId={bestId} updateScore={updateScore} />}
      {tab === 2 && <LegalTab suppliers={suppliers} project={project} />}
      {tab === 3 && <FinanceTab suppliers={suppliers} />}
      {tab === 4 && <TechTab suppliers={suppliers} onNext={onNext} onBack={onBack} project={project} />}
    </Panel>
  )
}

function OffersTab({ suppliers, project, onBack }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <input type="text" placeholder="Încarcă ofertă (PDF/Excel)..." style={{ flex: 1 }} />
        <Btn size="sm" variant="primary">+ Adaugă ofertă</Btn>
      </div>
      {suppliers.map((s, i) => (
        <div key={s.id} style={{ border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <ScoreBadge value={s.tech} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{s.country} · Primit: 15.06.2025</div>
            </div>
            <span style={{ fontSize: 15, fontWeight: 500 }}>{s.price.toLocaleString()} EUR</span>
          </div>
          <Grid cols={3} gap={8}>
            <MetricCard label="Scor tehnic" value={`${s.tech}/10`} />
            <MetricCard label="Lead time" value={`${s.delivery} zile`} />
            <MetricCard label="Referințe" value={s.refs} />
          </Grid>
        </div>
      ))}
      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <Btn size="sm" variant="secondary" onClick={onBack}>← Înapoi la colectare date</Btn>
        <Btn size="sm" variant="secondary" onClick={() => window.open(`https://claude.ai/new?q=${encodeURIComponent(`Analizează comparativ ofertele primite pentru ${project.name} și sugerează cea mai bună decizie`)}`, '_blank')}>
          Analiză AI ↗
        </Btn>
      </div>
    </div>
  )
}

function MatrixTab({ suppliers, scores, totals, bestId, updateScore }) {
  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ background: 'var(--color-bg-secondary)', padding: 8, textAlign: 'left', border: '0.5px solid var(--color-border)', fontWeight: 500, width: 180 }}>Criteriu / Pondere</th>
              {suppliers.map(s => (
                <th key={s.id} style={{
                  background: s.id === bestId ? 'var(--green-50)' : 'var(--color-bg-secondary)',
                  padding: 8, textAlign: 'center',
                  border: '0.5px solid var(--color-border)', fontWeight: 500,
                }}>
                  {s.name.split(' ')[0]}{s.id === bestId ? ' ★' : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EVALUATION_CRITERIA.map(c => (
              <tr key={c.id}>
                <td style={{ padding: 8, border: '0.5px solid var(--color-border)', fontWeight: 500 }}>
                  {c.label} <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>({Math.round(c.weight * 100)}%)</span>
                </td>
                {suppliers.map(s => {
                  const v = scores[s.id]?.[c.id] || 0
                  return (
                    <td key={s.id} style={{ padding: 4, border: '0.5px solid var(--color-border)', textAlign: 'center' }}>
                      <input
                        type="number" min="0" max="10" step="0.5"
                        value={v}
                        onChange={e => updateScore(s.id, c.id, e.target.value)}
                        style={{ width: 56, textAlign: 'center', fontWeight: 500, color: ScoreColor({ value: v }) }}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
            <tr style={{ borderTop: '2px solid var(--color-border-strong)' }}>
              <td style={{ padding: 8, border: '0.5px solid var(--color-border)', fontWeight: 500 }}>Scor ponderat total</td>
              {suppliers.map(s => (
                <td key={s.id} style={{
                  padding: 8, border: '0.5px solid var(--color-border)', textAlign: 'center',
                  fontSize: 15, fontWeight: 500,
                  color: s.id === bestId ? 'var(--green-800)' : 'var(--color-text-primary)',
                  background: s.id === bestId ? 'var(--green-50)' : 'transparent',
                }}>
                  {totals[s.id]?.toFixed(2)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: 'var(--color-text-secondary)' }}>
        Câștigător recomandat: <strong style={{ color: 'var(--green-800)' }}>{suppliers.find(s => s.id === bestId)?.name}</strong> · Scor: {totals[bestId]?.toFixed(2)}/10
      </div>
    </div>
  )
}

function LegalTab({ suppliers, project }) {
  const checks = ['Înregistrare comercială', 'Certificate ISO active', 'Fără litigii majore', 'Conformitate GDPR / DSGVO', 'Sancțiuni internaționale']
  return (
    <div>
      <Grid cols={2} gap={12} style={{ alignItems: 'start' }}>
        {suppliers.map(s => (
          <div key={s.id} style={{ border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{s.name}</div>
            {checks.map((item, i) => {
              const ok = i === 0 ? s.legalOk : i === 1 ? s.isoOk : i === 3 ? s.gdprOk : true
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 12 }}>
                  <span style={{ color: ok ? 'var(--green-600)' : 'var(--red-600)', fontSize: 14 }}>{ok ? '✓' : '✗'}</span>
                  <span style={{ flex: 1 }}>{item}</span>
                  <span style={{
                    fontSize: 11, padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontWeight: 500,
                    background: ok ? 'var(--green-50)' : 'var(--red-50)',
                    color: ok ? 'var(--green-800)' : 'var(--red-600)',
                  }}>
                    {ok ? 'OK' : 'Risc'}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </Grid>
      <WarnBox title="Atenție">
        Parker Hannifin — certificat ISO 9001 expirat în mart. 2025. Solicitați dovadă de reînnoire înainte de adjudecare.
      </WarnBox>
      <div style={{ marginTop: 10 }}>
        <Btn size="sm" variant="secondary" onClick={() => window.open(`https://claude.ai/new?q=${encodeURIComponent(`Care sunt verificările legale esențiale pentru un furnizor MRO din SUA care aprovizionează o fabrică automotive din România?`)}`, '_blank')}>
          Asistență juridică AI ↗
        </Btn>
      </div>
    </div>
  )
}

function FinanceTab({ suppliers }) {
  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            {['Furnizor', 'Cifra afaceri', 'Rating', 'Vechime', 'Risc financiar'].map(h => (
              <th key={h} style={{ background: 'var(--color-bg-secondary)', padding: 8, textAlign: 'left', border: '0.5px solid var(--color-border)', fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.id}>
              <td style={{ padding: 8, border: '0.5px solid var(--color-border)', fontWeight: 500 }}>{s.name}</td>
              <td style={{ padding: 8, border: '0.5px solid var(--color-border)' }}>{s.financial}</td>
              <td style={{ padding: 8, border: '0.5px solid var(--color-border)' }}>{s.rating}</td>
              <td style={{ padding: 8, border: '0.5px solid var(--color-border)' }}>{s.age} ani</td>
              <td style={{ padding: 8, border: '0.5px solid var(--color-border)' }}>
                <span style={{
                  fontSize: 11, padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontWeight: 500,
                  background: s.risk === 'Scăzut' ? 'var(--green-50)' : 'var(--amber-50)',
                  color: s.risk === 'Scăzut' ? 'var(--green-800)' : 'var(--amber-800)',
                }}>{s.risk}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TechTab({ suppliers, onNext, onBack, project }) {
  const techChecks = [
    'Conformitate specificații tehnice',
    'Referințe automotive verificate',
    'Certificări produs',
    'Capacitate producție',
  ]
  return (
    <div>
      <Grid cols={2} gap={12} style={{ alignItems: 'start', marginBottom: '1rem' }}>
        {suppliers.map(s => (
          <div key={s.id} style={{ border: '0.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <ScoreBadge value={s.tech} />
              <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
            </div>
            {techChecks.map((label, i) => {
              const score = [s.tech, s.refs * 1.5, s.tech >= 8 ? 9 : 7, s.tech >= 8.5 ? 8 : 7][i]
              const clampedScore = Math.min(10, Math.round(score * 10) / 10)
              const color = clampedScore >= 8 ? '#1D9E75' : clampedScore >= 6 ? '#EF9F27' : '#E24B4A'
              return (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                    <span style={{ fontWeight: 500, color }}>{clampedScore}/10</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: 'var(--color-bg-secondary)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 2, background: color, width: `${clampedScore * 10}%` }} />
                  </div>
                </div>
              )
            })}
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 6 }}>
              Referințe externe: {s.refs} parteneri verificați
            </div>
          </div>
        ))}
      </Grid>
      <Actions>
        <Btn variant="secondary" onClick={onBack}>← Înapoi la RFQ</Btn>
        <Btn variant="secondary" onClick={() => window.open(`https://claude.ai/new?q=${encodeURIComponent(`Evaluare tehnică comparativă furnizori MRO ${project.category}: ${suppliers.map(s=>s.name).join(', ')}`)}`, '_blank')}>
          Evaluare AI ↗
        </Btn>
        <Btn variant="primary" onClick={onNext}>Continuă → Business Case</Btn>
      </Actions>
    </div>
  )
}
