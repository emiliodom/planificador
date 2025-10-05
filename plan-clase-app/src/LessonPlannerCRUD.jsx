import React, { useState, useEffect } from 'react';
import { Calendar, Book, Target, FileText, Package, Save, X, Edit, Trash2, Plus, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 🔗 NocoDB Configuration from environment variables
const API_BASE = import.meta.env.VITE_NOCODB_API_BASE;
const API_TOKEN = import.meta.env.VITE_NOCODB_API_TOKEN;

// Validate environment variables
if (!API_BASE || !API_TOKEN) {
  console.error('❌ Missing NocoDB configuration. Please check your .env.local file.');
  console.error('Required variables: VITE_NOCODB_API_BASE, VITE_NOCODB_API_TOKEN');
}

// 📡 Headers for all API requests
const headers = {
  'xc-token': API_TOKEN,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export default function LessonPlannerCRUD() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    docente: '',
    curso: '',
    tema: '',
    fecha: '',
    objetivos: '',
    contenido: '',
    recursos: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/records`, { headers });
      const data = await response.json();
      console.log(data);
      // Transform NocoDB v3 data structure to match our component expectations
      const transformedPlans = data.records?.map(record => ({
        Id: record.id,
        ...record.fields
      })) || [];
      setPlans(transformedPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      alert('Error al cargar los planes de clase');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update - NocoDB v3 uses bulk update format
        await fetch(`${API_BASE}/records`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify([{
            id: editingId,
            fields: formData
          }])
        });
      } else {
        // Create - for NocoDB v3, send as fields object
        await fetch(`${API_BASE}/records`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            fields: formData
          })
        });
      }
      
      resetForm();
      fetchPlans();
      alert(editingId ? 'Plan actualizado exitosamente' : 'Plan creado exitosamente');
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Error al guardar el plan de clase');
    }
    setLoading(false);
  };

  const handleEdit = (plan) => {
    setFormData({
      docente: plan.docente || '',
      curso: plan.curso || '',
      tema: plan.tema || '',
      fecha: plan.fecha || '',
      objetivos: plan.objetivos || '',
      contenido: plan.contenido || '',
      recursos: plan.recursos || ''
    });
    setEditingId(plan.Id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este plan de clase?')) return;
    
    setLoading(true);
    try {
      await fetch(`${API_BASE}/records`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify([{ id: id }])
      });
      fetchPlans();
      alert('Plan eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Error al eliminar el plan de clase');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      docente: '',
      curso: '',
      tema: '',
      fecha: '',
      objetivos: '',
      contenido: '',
      recursos: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const exportToPDF = async (plan) => {
    try {
      // Create a temporary div with the plan content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '40px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0891b2; padding-bottom: 20px;">
          <h1 style="color: #0891b2; margin: 0; font-size: 28px;">Plan de Clase</h1>
          <h2 style="color: #374151; margin: 10px 0 0 0; font-size: 22px;">${plan.tema}</h2>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
          <div>
            <strong style="color: #0891b2;">Docente:</strong> ${plan.docente}
          </div>
          <div>
            <strong style="color: #0891b2;">Curso:</strong> ${plan.curso}
          </div>
          <div>
            <strong style="color: #0891b2;">Fecha:</strong> ${plan.fecha}
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="color: #0891b2; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">
            🎯 Objetivos (Logros)
          </h3>
          <p style="line-height: 1.6; color: #374151; text-align: justify;">${plan.objetivos}</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="color: #0891b2; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">
            📝 Contenido
          </h3>
          <p style="line-height: 1.6; color: #374151; text-align: justify;">${plan.contenido}</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="color: #0891b2; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">
            📦 Recursos
          </h3>
          <p style="line-height: 1.6; color: #374151; text-align: justify;">${plan.recursos}</p>
        </div>
        
        <div style="margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          Generado el ${new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove temporary div
      document.body.removeChild(tempDiv);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save PDF
      pdf.save(`plan-clase-${plan.tema.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF');
    }
  };

  const exportAllToPDF = async () => {
    if (plans.length === 0) {
      alert('No hay planes de clase para exportar');
      return;
    }

    try {
      setLoading(true);
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageHeight = 295;
      const margin = 20;
      const contentWidth = 170;
      
      // Cover page
      pdf.setFontSize(24);
      pdf.setTextColor(8, 145, 178);
      pdf.text('Planes de Clase', 105, 50, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setTextColor(55, 65, 81);
      pdf.text(`Compilación de ${plans.length} planes`, 105, 70, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Generado el ${new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, 105, 90, { align: 'center' });
      
      // Table of contents
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.setTextColor(8, 145, 178);
      pdf.text('Índice', margin, 30);
      
      let yPos = 50;
      pdf.setFontSize(12);
      pdf.setTextColor(55, 65, 81);
      
      plans.forEach((plan, index) => {
        const pageNum = index + 3; // Starting from page 3
        pdf.text(`${index + 1}. ${plan.tema}`, margin, yPos);
        pdf.text(`Página ${pageNum}`, 180, yPos, { align: 'right' });
        yPos += 10;
        
        if (yPos > 250) {
          pdf.addPage();
          yPos = 30;
        }
      });
      
      // Individual plans
      for (let i = 0; i < plans.length; i++) {
        const plan = plans[i];
        pdf.addPage();
        
        // Header
        pdf.setFontSize(20);
        pdf.setTextColor(8, 145, 178);
        pdf.text(plan.tema, margin, 30);
        
        // Basic info
        pdf.setFontSize(12);
        pdf.setTextColor(55, 65, 81);
        let currentY = 50;
        
        pdf.text(`Docente: ${plan.docente}`, margin, currentY);
        pdf.text(`Curso: ${plan.curso}`, margin, currentY + 10);
        pdf.text(`Fecha: ${plan.fecha}`, margin, currentY + 20);
        
        currentY += 40;
        
        // Objectives
        pdf.setFontSize(14);
        pdf.setTextColor(8, 145, 178);
        pdf.text('🎯 Objetivos (Logros)', margin, currentY);
        currentY += 10;
        
        pdf.setFontSize(11);
        pdf.setTextColor(55, 65, 81);
        const objectivesLines = pdf.splitTextToSize(plan.objetivos, contentWidth);
        pdf.text(objectivesLines, margin, currentY);
        currentY += objectivesLines.length * 5 + 10;
        
        // Content
        if (currentY > 200) {
          pdf.addPage();
          currentY = 30;
        }
        
        pdf.setFontSize(14);
        pdf.setTextColor(8, 145, 178);
        pdf.text('📝 Contenido', margin, currentY);
        currentY += 10;
        
        pdf.setFontSize(11);
        pdf.setTextColor(55, 65, 81);
        const contentLines = pdf.splitTextToSize(plan.contenido, contentWidth);
        pdf.text(contentLines, margin, currentY);
        currentY += contentLines.length * 5 + 10;
        
        // Resources
        if (currentY > 200) {
          pdf.addPage();
          currentY = 30;
        }
        
        pdf.setFontSize(14);
        pdf.setTextColor(8, 145, 178);
        pdf.text('📦 Recursos', margin, currentY);
        currentY += 10;
        
        pdf.setFontSize(11);
        pdf.setTextColor(55, 65, 81);
        const resourcesLines = pdf.splitTextToSize(plan.recursos, contentWidth);
        pdf.text(resourcesLines, margin, currentY);
        
        // Page number
        pdf.setFontSize(10);
        pdf.setTextColor(107, 114, 128);
        pdf.text(`Página ${pdf.internal.getNumberOfPages()}`, 105, 285, { align: 'center' });
      }
      
      // Save PDF
      pdf.save(`todos-los-planes-de-clase-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF completo');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h1 
              className="text-3xl font-bold text-cyan-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Plan de Clase - Gestión
            </motion.h1>
            <div className="flex gap-2">
              {plans.length > 0 && (
                <motion.button
                  onClick={exportAllToPDF}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  disabled={loading}
                >
                  <Download size={20} />
                  Exportar Todo
                </motion.button>
              )}
              <motion.button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {showForm ? <X size={20} /> : <Plus size={20} />}
                {showForm ? 'Cancelar' : 'Nuevo Plan'}
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.form 
                onSubmit={handleSubmit} 
                className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg mb-6"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
              <h2 className="text-xl font-semibold text-cyan-700 mb-4">
                {editingId ? 'Editar Plan de Clase' : 'Nuevo Plan de Clase'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Docente
                  </label>
                  <input
                    type="text"
                    name="docente"
                    value={formData.docente}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Nombre y apellido"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Curso
                  </label>
                  <input
                    type="text"
                    name="curso"
                    value={formData.curso}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="X nivel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tema
                  </label>
                  <input
                    type="text"
                    name="tema"
                    value={formData.tema}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Tema de la clase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objetivos (Logros)
                  </label>
                  <textarea
                    name="objetivos"
                    value={formData.objetivos}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Conocimientos, habilidades o aptitudes esperadas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contenido
                  </label>
                  <textarea
                    name="contenido"
                    value={formData.contenido}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Temas que se enseñarán durante la clase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recursos
                  </label>
                  <textarea
                    name="recursos"
                    value={formData.recursos}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Materiales y recursos necesarios"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={18} />
                  {editingId ? 'Actualizar' : 'Guardar'}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X size={18} />
                  Cancelar
                </motion.button>
              </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {loading && !showForm ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            <p className="mt-4 text-gray-600">Cargando planes...</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {plans.map((plan, index) => (
              <motion.div 
                key={plan.Id} 
                className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-cyan-700 mb-1">{plan.tema}</h3>
                    <p className="text-sm text-gray-600">{plan.curso}</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => exportToPDF(plan)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Exportar a PDF"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Download size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleEdit(plan)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Editar"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(plan.Id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Book size={16} className="text-cyan-500" />
                    <span className="font-medium">Docente:</span>
                    <span>{plan.docente}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar size={16} className="text-cyan-500" />
                    <span className="font-medium">Fecha:</span>
                    <span>{plan.fecha}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-start gap-2 mb-2">
                      <Target size={16} className="text-cyan-500 mt-1" />
                      <div>
                        <span className="font-medium text-gray-700">Objetivos:</span>
                        <p className="text-gray-600 mt-1 line-clamp-2">{plan.objetivos}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mb-2">
                      <FileText size={16} className="text-cyan-500 mt-1" />
                      <div>
                        <span className="font-medium text-gray-700">Contenido:</span>
                        <p className="text-gray-600 mt-1 line-clamp-2">{plan.contenido}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Package size={16} className="text-cyan-500 mt-1" />
                      <div>
                        <span className="font-medium text-gray-700">Recursos:</span>
                        <p className="text-gray-600 mt-1 line-clamp-2">{plan.recursos}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && plans.length === 0 && (
          <motion.div 
            className="text-center py-12 bg-white rounded-lg shadow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Book size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No hay planes de clase registrados</p>
              <p className="text-gray-400 mt-2">Haz clic en "Nuevo Plan" para comenzar</p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}