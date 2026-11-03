import React from 'react';
import { Printer, X, CheckCircle2, QrCode, Building2, Calendar, User, MapPin, BookOpen, Clock } from 'lucide-react';
import { MatriculaData } from '../types/matricula';

interface ComprobanteModalProps {
  matricula: MatriculaData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ComprobanteModal: React.FC<ComprobanteModalProps> = ({ matricula, isOpen, onClose }) => {
  if (!isOpen || !matricula) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="comprobante-title"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
      >
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold tracking-wide">
              Comprobante Oficial de Matrícula
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Cerrar comprobante"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Body */}
        <div id="printable-voucher" className="p-8 overflow-y-auto space-y-6 bg-white text-slate-800">
          {/* Institution Header */}
          <div className="border-b border-slate-200 pb-6 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  CAMPUS TECH · INSTITUTO SUPERIOR
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Departamento de Admisiones y Registro Académico · Ciclo 2026/2027
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Número de Folio</span>
              <span className="text-sm font-bold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                {matricula.numeroMatricula || 'MAT-2026-NUEVO'}
              </span>
            </div>
          </div>

          {/* Registration Date & Status */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Fecha de Matrícula</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {matricula.fechaMatricula}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Estado Académico</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Matriculado Activo
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Turno Asignado</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {matricula.turno || 'Regular'}
              </span>
            </div>
          </div>

          {/* Student Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Datos del Alumno
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-400 block">Apellidos y Nombres</span>
                <span className="text-sm font-semibold text-slate-900 block mt-0.5">
                  {matricula.alumno}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Documento de Identidad (DNI)</span>
                <span className="text-sm font-mono text-slate-800 block mt-0.5">
                  {matricula.dni || 'No especificado'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Sexo / Género</span>
                <span className="text-sm text-slate-800 block mt-0.5">
                  {matricula.sexo || 'No declarado'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Distrito de Residencia</span>
                <span className="text-sm font-medium text-slate-800 block mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {matricula.distrito}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-slate-400 block">Dirección Particular</span>
                <span className="text-sm text-slate-800 block mt-0.5">
                  {matricula.direccion}
                </span>
              </div>
            </div>
          </div>

          {/* Course Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              Asignatura de Computación & Tecnología
            </h4>
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40">
              <span className="text-xs font-semibold text-indigo-600 block uppercase tracking-wider">
                Curso Matriculado
              </span>
              <p className="text-base font-bold text-slate-900 mt-1">
                {matricula.curso}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600 border-t border-indigo-100 pt-3">
                <span>Certificación oficial universitaria</span>
                <span aria-hidden="true">·</span>
                <span>Acceso a campus virtual 24/7</span>
                <span aria-hidden="true">·</span>
                <span>Laboratorios prácticos integrados</span>
              </div>
            </div>
          </div>

          {/* QR Code & Digital Signature */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center p-1">
                <QrCode className="w-11 h-11 text-slate-800" />
              </div>
              <div>
                <span className="font-mono text-slate-700 block font-medium">Validación Criptográfica</span>
                <span className="text-[11px] text-slate-400">Verifique la autenticidad escaneando el código QR oficial.</span>
              </div>
            </div>
            <div className="text-center sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
              <div className="w-36 border-b border-slate-300 mx-auto sm:ml-auto mb-1"></div>
              <span className="text-[11px] font-medium text-slate-600 block">Firma y Sello de Secretaría</span>
              <span className="text-[10px] text-slate-400 block">Autorizado automáticamente</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir Comprobante
          </button>
        </div>
      </div>
    </div>
  );
};
