'use client';

import { useState } from 'react';
import { Panel } from '@/components/shared/panel';
import { PanelHeader } from '@/components/shared/panel-header';

export function CaseLogForm() {
  const [logType, setLogType] = useState<'operative' | 'bedside'>('operative');

  const inputClasses = 'bg-[var(--bg)] border border-[var(--gf-border-hi)] rounded-lg py-[9px] px-[11px] text-sm text-[var(--text-1)] w-full';
  const labelClasses = 'text-[11px] font-semibold tracking-[0.07em] uppercase text-[var(--text-3)] mb-[6px] block';

  return (
    <Panel>
      <PanelHeader title="Log a Case" />
      <div className="px-[22px] pb-5">
        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-5 border-b border-[var(--gf-border)]">
          <button
            onClick={() => setLogType('operative')}
            className={`pb-3 px-2 text-[13px] font-medium transition-colors ${
              logType === 'operative'
                ? 'text-[var(--ac-blue)] border-b-2 border-[var(--ac-blue)]'
                : 'text-[var(--text-3)] hover:text-[var(--text-2)]'
            }`}
          >
            Operative Case
          </button>
          <button
            onClick={() => setLogType('bedside')}
            className={`pb-3 px-2 text-[13px] font-medium transition-colors ${
              logType === 'bedside'
                ? 'text-[var(--ac-blue)] border-b-2 border-[var(--ac-blue)]'
                : 'text-[var(--text-3)] hover:text-[var(--text-2)]'
            }`}
          >
            Bedside Procedure
          </button>
        </div>

        {/* Operative Form */}
        {logType === 'operative' && (
          <div className="space-y-4">
            {/* Row 1: Case ID, Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Case ID <span className="text-[var(--ac-orange)]">*</span></label>
                <input type="text" placeholder="e.g. 2026-0128" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Date <span className="text-[var(--ac-orange)]">*</span></label>
                <input type="date" defaultValue="2026-03-13" className={inputClasses} />
              </div>
            </div>

            {/* Row 2: PGY, Rotation, Role */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>PGY <span className="text-[var(--ac-orange)]">*</span></label>
                <select className={inputClasses}>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Rotation <span className="text-[var(--ac-orange)]">*</span></label>
                <select className={inputClasses}>
                  <option value="">-- Select --</option>
                  <option>General Surgery</option>
                  <option>Trauma Surgery</option>
                  <option>Vascular Surgery</option>
                  <option>Colorectal</option>
                  <option>Hepatobiliary</option>
                  <option>Breast Surgery</option>
                  <option>Endocrine Surgery</option>
                  <option>Thoracic Surgery</option>
                  <option>Pediatric Surgery</option>
                  <option>Surgical Critical Care</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Role <span className="text-[var(--ac-orange)]">*</span></label>
                <select className={inputClasses}>
                  <option value="">-- Select --</option>
                  <option value="SC">SC – Surgeon Chief</option>
                  <option value="SJ">SJ – Surgeon Junior</option>
                  <option value="TA">TA – Teaching Assistant</option>
                  <option value="FA">FA – First Assistant</option>
                </select>
              </div>
            </div>

            {/* Row 3: Site, Attending */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Site <span className="text-[var(--ac-orange)]">*</span></label>
                <select className={inputClasses}>
                  <option value="">-- Select --</option>
                  <option>University Hospital</option>
                  <option>VA Medical Center</option>
                  <option>St. Michael&apos;s Hospital</option>
                  <option>County Hospital</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Attending <span className="text-[var(--ac-orange)]">*</span></label>
                <select className={inputClasses}>
                  <option value="">-- Select --</option>
                  <option>Dr. Faisal Jehan</option>
                  <option>Dr. Sarah Okoye</option>
                  <option>Dr. James Patel</option>
                  <option>Dr. Maria Reyes</option>
                </select>
              </div>
            </div>

            {/* Row 4: Patient Type, Operative Autonomy */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Patient Type <span className="text-[var(--ac-orange)]">*</span></label>
                <select className={inputClasses}>
                  <option>Adult</option>
                  <option>Pediatric</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Operative Autonomy Given</label>
                <select className={inputClasses}>
                  <option value="">-- Select --</option>
                  <option value="show-tell">Show & Tell — Attending demonstrated</option>
                  <option value="active-assist">Active Assistance — Attending guided throughout</option>
                  <option value="passive-help">Passive Help — I led, attending assisted when needed</option>
                  <option value="supervision">Supervision Only — I led, attending observed</option>
                  <option value="solo">Solo — Unsupervised</option>
                </select>
              </div>
            </div>

            {/* Row 5: Defined Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Defined Category</label>
                <select className={inputClasses}>
                  <option value="">-- Select --</option>
                  <optgroup label="Abdominal">
                    <option>Biliary</option>
                    <option>Hernia</option>
                    <option>Liver</option>
                    <option>Pancreas</option>
                  </optgroup>
                  <optgroup label="Alimentary Tract">
                    <option>Esophagus</option>
                    <option>Stomach</option>
                    <option>Small Intestine</option>
                    <option>Large Intestine</option>
                    <option>Appendix</option>
                    <option>Anorectal</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option>Skin / Soft Tissue</option>
                    <option>Breast</option>
                    <option>Head and Neck</option>
                    <option>Vascular</option>
                    <option>Endocrine</option>
                    <option>Operative Trauma</option>
                    <option>Non-Operative Trauma</option>
                    <option>Thoracic Surgery</option>
                    <option>Pediatric Surgery</option>
                    <option>Surgical Critical Care</option>
                    <option>Laparoscopic Basic</option>
                    <option>Laparoscopic Complex</option>
                    <option>Upper Endoscopy</option>
                    <option>Colonoscopy</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Procedure / CPT</label>
                <input type="text" placeholder="e.g. Laparoscopic cholecystectomy" className={inputClasses} />
              </div>
            </div>

            {/* Checkbox: Trauma */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="trauma-check" className="w-4 h-4" />
              <label htmlFor="trauma-check" className="text-sm text-[var(--text-2)] cursor-pointer">
                Involved Trauma
              </label>
            </div>

            {/* Textarea: Comments */}
            <div>
              <label className={labelClasses}>Comments</label>
              <textarea
                placeholder="Optional notes…"
                rows={3}
                className={`${inputClasses} resize-none`}
              />
            </div>

            {/* Submit Button */}
            <button className="w-full bg-[var(--ac-orange)] hover:opacity-90 transition-opacity text-white text-sm font-medium py-2.5 rounded-lg">
              Log Case
            </button>
          </div>
        )}

        {/* Bedside Form */}
        {logType === 'bedside' && (
          <div className="space-y-4">
            {/* Row 1: Procedure Type, Site / Laterality */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Procedure Type <span className="text-[var(--ac-orange)]">*</span></label>
                <select className={inputClasses}>
                  <option value="">Select procedure...</option>
                  <option>Central Line (IJ)</option>
                  <option>Central Line (Subclavian)</option>
                  <option>Central Line (Femoral)</option>
                  <option>Arterial Line (Radial)</option>
                  <option>Arterial Line (Femoral)</option>
                  <option>Chest Tube</option>
                  <option>Thoracentesis</option>
                  <option>Paracentesis</option>
                  <option>Wound VAC</option>
                  <option>Abscess I&D</option>
                  <option>Tracheostomy Care</option>
                  <option>G/J-Tube Management</option>
                  <option>Drain Management</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Site / Laterality</label>
                <select className={inputClasses}>
                  <option value="">N/A</option>
                  <option>Left</option>
                  <option>Right</option>
                  <option>Midline</option>
                </select>
              </div>
            </div>

            {/* Row 2: Ultrasound, Supervision, Complications */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>Ultrasound-Guided</label>
                <div className="flex items-center gap-2 bg-[var(--bg)] border border-[var(--gf-border-hi)] rounded-lg px-3 py-2">
                  <input type="checkbox" id="us-check" className="w-4 h-4" />
                  <label htmlFor="us-check" className="text-sm text-[var(--text-2)] cursor-pointer flex-1">
                    Yes
                  </label>
                </div>
              </div>
              <div>
                <label className={labelClasses}>Supervision</label>
                <select className={inputClasses}>
                  <option>Supervised</option>
                  <option>Independent</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Complications</label>
                <select className={inputClasses}>
                  <option>None</option>
                  <option>Minor</option>
                  <option>Major</option>
                </select>
              </div>
            </div>

            {/* Row 3: Date, Attending */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Date <span className="text-[var(--ac-orange)]">*</span></label>
                <input type="date" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Attending</label>
                <input type="text" placeholder="Dr. Last Name" className={inputClasses} />
              </div>
            </div>

            {/* Textarea: Comments */}
            <div>
              <label className={labelClasses}>Comments</label>
              <textarea
                placeholder="Any complications or notes…"
                rows={2}
                className={`${inputClasses} resize-none`}
              />
            </div>

            {/* Submit Button */}
            <button className="w-full bg-[var(--ac-orange)] hover:opacity-90 transition-opacity text-white text-sm font-medium py-2.5 rounded-lg">
              Log Procedure
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
}
