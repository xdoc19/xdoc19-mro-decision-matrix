import React from 'react'
import { STEPS } from '../data/constants.js'

export default function ProgressBar({ currentStep, maxReached, onGoStep }) {
  return (
    <div style={{
      background: 'var(--color-bg)',
      border: '0.5px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.25rem',
      marginBottom: '1.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {STEPS[currentStep].label}
        </span>
        <span style={{
          fontSize: 11, padding: '3px 8px', borderRadius: 'var(--radius-md)', fontWeight: 500,
          background: 'var(--blue-50)', color: 'var(--blue-800)',
        }}>
          Etapa {currentStep + 1}/{STEPS.length}
        </span>
      </div>

      {/* Step dots */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {STEPS.map((step, i) => {
          const isDone   = i < currentStep
          const isActive = i === currentStep
          const canClick = i <= maxReached
          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => canClick && onGoStep(i)}
                title={step.label}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 500, flexShrink: 0,
                  cursor: canClick ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  background: isDone  ? '#1D9E75'
                             : isActive ? 'var(--blue-600)'
                             : 'var(--color-bg)',
                  color: isDone || isActive ? '#fff' : 'var(--color-text-secondary)',
                  border: isDone || isActive ? 'none' : '0.5px solid var(--color-border-strong)',
                  boxShadow: isActive ? '0 0 0 3px rgba(24,95,165,0.18)' : 'none',
                }}
              >
                {isDone ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 1, margin: '0 4px',
                  background: isDone ? '#1D9E75' : 'var(--color-border)',
                  transition: 'background 0.3s',
                }} />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Step labels */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, marginTop: 8 }}>
        {STEPS.map((step, i) => (
          <div
            key={step.id}
            style={{
              fontSize: 10, textAlign: 'center', padding: '0 2px',
              color: i < currentStep  ? '#1D9E75'
                   : i === currentStep ? 'var(--blue-600)'
                   : 'var(--color-text-muted)',
              fontWeight: i === currentStep ? 500 : 400,
            }}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  )
}
