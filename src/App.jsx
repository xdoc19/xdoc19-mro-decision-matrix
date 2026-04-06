import React, { useState, useCallback } from 'react'
import { SAMPLE_PROJECTS } from './data/constants.js'
import ProjectList from './components/ProjectList.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import StepCollect from './components/StepCollect.jsx'
import StepRFQ from './components/StepRFQ.jsx'
import StepAnalysis from './components/StepAnalysis.jsx'
import StepBusinessCase from './components/StepBusinessCase.jsx'
import StepDecision from './components/StepDecision.jsx'

const STORAGE_KEY = 'mro_projects_v1'

function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : SAMPLE_PROJECTS
  } catch {
    return SAMPLE_PROJECTS
  }
}

function saveProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch {}
}

export default function App() {
  const [projects, setProjects] = useState(loadProjects)
  const [currentId, setCurrentId] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)

  const currentProject = projects.find(p => p.id === currentId)

  const persistProjects = (updated) => {
    setProjects(updated)
    saveProjects(updated)
  }

  const updateProject = useCallback((id, patch) => {
    setProjects(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...patch } : p)
      saveProjects(next)
      return next
    })
  }, [])

  const onChange = (patch) => updateProject(currentId, patch)

  const openProject = (id) => {
    const p = projects.find(proj => proj.id === id)
    setCurrentId(id)
    setCurrentStep(p.step)
  }

  const createProject = (data) => {
    const newProject = {
      id: Date.now(),
      ...data,
      step: 0,
      checklist: {},
      specs: {},
      rfq: {},
      suppliers: [],
      selectedSuppliers: [],
      scores: {},
      businessCase: { savings: 0, investment: 0, payback: 0, roi: 0, justification: '', risks: '' },
      decision: { approvedBy: '', date: '', notes: '' },
      actionItems: {},
      activeTab: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    const next = [newProject, ...projects]
    persistProjects(next)
    openProject(newProject.id)
  }

  const goStep = (step) => {
    setCurrentStep(step)
  }

  const advanceStep = () => {
    const next = currentStep + 1
    setCurrentStep(next)
    updateProject(currentId, { step: Math.max(currentProject.step, next) })
  }

  const backStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const backToProjects = () => {
    setCurrentId(null)
    setCurrentStep(0)
  }

  const finishProject = () => {
    updateProject(currentId, { step: 4 })
    backToProjects()
  }

  // App shell
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-tertiary)', padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'var(--blue-600)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0,
            }}>M</div>
            <div>
              <h1
                style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-text-primary)', cursor: currentId ? 'pointer' : 'default' }}
                onClick={currentId ? backToProjects : undefined}
              >
                MRO Decision Matrix
              </h1>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                {currentId ? currentProject?.name : 'Gestionare proiecte de achiziție MRO cu matrice de decizie multi-criterii'}
              </p>
            </div>
          </div>
        </div>

        {/* View: Project list */}
        {!currentId && (
          <ProjectList projects={projects} onOpen={openProject} onCreate={createProject} />
        )}

        {/* View: Wizard */}
        {currentId && currentProject && (
          <>
            {/* Back link */}
            <div
              onClick={backToProjects}
              style={{
                fontSize: 12, color: 'var(--color-text-secondary)',
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                gap: 4, marginBottom: '1rem',
              }}
            >
              ← Toate proiectele
            </div>

            <ProgressBar
              currentStep={currentStep}
              maxReached={currentProject.step + 1}
              onGoStep={goStep}
            />

            {currentStep === 0 && (
              <StepCollect
                project={currentProject}
                onChange={onChange}
                onNext={advanceStep}
              />
            )}
            {currentStep === 1 && (
              <StepRFQ
                project={currentProject}
                onChange={onChange}
                onNext={advanceStep}
                onBack={backStep}
              />
            )}
            {currentStep === 2 && (
              <StepAnalysis
                project={currentProject}
                onChange={onChange}
                onNext={advanceStep}
                onBack={backStep}
              />
            )}
            {currentStep === 3 && (
              <StepBusinessCase
                project={currentProject}
                onChange={onChange}
                onNext={advanceStep}
                onBack={backStep}
              />
            )}
            {currentStep === 4 && (
              <StepDecision
                project={currentProject}
                onChange={onChange}
                onBack={backStep}
                onFinish={finishProject}
              />
            )}
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: 11, color: 'var(--color-text-muted)' }}>
          MRO Decision Matrix · Litens Automotive
        </div>
      </div>
    </div>
  )
}
