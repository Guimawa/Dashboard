import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network } from '@visx/network';
import { Group } from '@visx/group';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Bell, Menu, Filter, Calendar, Wrench, ChevronDown, Star, Share, Info, User, Settings } from 'lucide-react';
import placeholderData from '../data/sample-placeholder.json';

// Couleurs du design (identiques mais sans données réelles)
const networkColors = {
  central: '#00BFFF',
  node1: '#10B981',
  node2: '#F59E0B', 
  node3: '#EF4444',
  node4: '#8B5CF6',
  node5: '#06B6D4',
  node6: '#F97316',
  node7: '#84CC16',
  node8: '#EC4899'
};

// Onglets avec contenu PLACEHOLDER uniquement
const sidebarTabs = [
  { 
    name: 'New Projet', 
    icon: '📋',
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Créer un Nouveau Projet</h3>
          <p className="text-gray-400 text-sm">Formulaire vide - placeholder</p>
        </div>
        <div className="space-y-4">
          <div className="bg-slate-800/30 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-2">Nom du projet</p>
            <div className="w-full h-10 bg-slate-700/50 rounded border border-gray-600 flex items-center px-3">
              <span className="text-gray-500 text-sm">Placeholder nom...</span>
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-2">Description</p>
            <div className="w-full h-20 bg-slate-700/50 rounded border border-gray-600 flex items-center px-3">
              <span className="text-gray-500 text-sm">Placeholder description...</span>
            </div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
            Créer le projet (placeholder)
          </Button>
        </div>
      </div>
    )
  },
  { 
    name: 'Table Ronde IA', 
    icon: '🤖',
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Brainstorm Multi-IA</h3>
          <p className="text-gray-400 text-sm">Zone placeholder pour idées</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4">
          <p className="text-gray-300 text-sm mb-2">Saisie idée</p>
          <div className="w-full h-32 bg-slate-700/50 rounded border border-gray-600 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Zone texte placeholder...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/30 rounded p-3 text-center">
            <p className="text-xs text-gray-400">IA Service 1</p>
            <p className="text-gray-500 text-xs mt-1">Réponse placeholder</p>
          </div>
          <div className="bg-slate-800/30 rounded p-3 text-center">
            <p className="text-xs text-gray-400">IA Service 2</p>
            <p className="text-gray-500 text-xs mt-1">Réponse placeholder</p>
          </div>
          <div className="bg-slate-800/30 rounded p-3 text-center">
            <p className="text-xs text-gray-400">IA Service 3</p>
            <p className="text-gray-500 text-xs mt-1">Réponse placeholder</p>
          </div>
          <div className="bg-slate-800/30 rounded p-3 text-center">
            <p className="text-xs text-gray-400">Synthèse</p>
            <p className="text-gray-500 text-xs mt-1">Placeholder</p>
          </div>
        </div>
      </div>
    )
  },
  { 
    name: 'Outils (Keys API)', 
    icon: '🔐',
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Coffre-fort</h3>
          <p className="text-gray-400 text-sm">Stockage placeholder pour clés</p>
        </div>
        <div className="space-y-3">
          {placeholderData.tools.map((service, i) => (
            <div key={i} className="bg-slate-800/30 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-gray-300 text-sm">{service.name}</p>
                <p className="text-gray-500 text-xs">Placeholder - non configuré</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs" disabled>
                Placeholder
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  },
  { 
    name: 'Vue d\'ensemble', 
    icon: '📊',
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Statuts Projets</h3>
          <p className="text-gray-400 text-sm">Vue globale placeholder</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-3 text-center">
            <p className="text-gray-400 text-2xl font-bold">0</p>
            <p className="text-gray-500 text-xs">En cours</p>
          </div>
          <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-3 text-center">
            <p className="text-gray-400 text-2xl font-bold">0</p>
            <p className="text-gray-500 text-xs">Bloqués</p>
          </div>
          <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-3 text-center">
            <p className="text-gray-400 text-2xl font-bold">0</p>
            <p className="text-gray-500 text-xs">Terminés</p>
          </div>
        </div>
        <div className="space-y-2">
          {placeholderData.projects.recent.map((project, i) => (
            <div key={i} className="bg-slate-800/30 rounded p-3 flex justify-between">
              <div>
                <p className="text-gray-400 text-sm">{project.name}</p>
                <p className="text-gray-500 text-xs">{project.description}</p>
              </div>
              <div className="text-gray-500 text-xs">
                Status: {project.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  { 
    name: 'Suivi Performances', 
    icon: '📈',
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Analytics</h3>
          <p className="text-gray-400 text-sm">Métriques placeholder</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4">
          <p className="text-gray-300 text-sm mb-3">Performance Overview</p>
          <div className="w-full h-32 bg-slate-700/30 rounded flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Graph placeholder</p>
              <p className="text-gray-600 text-xs">Données vides</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/30 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Métrique A</p>
            <p className="text-gray-500 text-lg font-bold">0</p>
          </div>
          <div className="bg-slate-800/30 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Métrique B</p>
            <p className="text-gray-500 text-lg font-bold">0</p>
          </div>
        </div>
      </div>
    )
  }
];

// Menu barre de tâches
const taskbarMenus = [
  {
    name: 'Fichier',
    items: ['Nouveau Projet', 'Ouvrir', 'Sauvegarder', 'Exporter PDF', 'Exporter CSV']
  },
  {
    name: 'Édition', 
    items: ['Copier', 'Coller', 'Annuler', 'Refaire', 'Préférences']
  },
  {
    name: 'Affichage',
    items: ['Zoom +', 'Zoom -', 'Plein écran', 'Mode sombre', 'Miniature']
  },
  {
    name: 'Aide',
    items: ['Documentation', 'Support', 'Raccourcis', 'À propos']
  }
];

export default function HandshakeDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskbarOpen, setIsTaskbarOpen] = useState(false);

  // Graph réseau PLACEHOLDER (même densité visuelle mais labels vides)
  const networkData = {
    nodes: [
      // Nœud central
      { id: 'central', x: 200, y: 150, r: 35, color: networkColors.central, label: '' },
      
      // Nœuds principaux 
      { id: 'node-1', x: 120, y: 80, r: 28, color: networkColors.node1, label: '' },
      { id: 'node-2', x: 280, y: 80, r: 26, color: networkColors.node2, label: '' },
      { id: 'node-3', x: 320, y: 150, r: 30, color: networkColors.node3, label: '' },
      { id: 'node-4', x: 280, y: 220, r: 24, color: networkColors.node4, label: '' },
      { id: 'node-5', x: 200, y: 260, r: 27, color: networkColors.node5, label: '' },
      { id: 'node-6', x: 120, y: 220, r: 25, color: networkColors.node6, label: '' },
      { id: 'node-7', x: 80, y: 150, r: 22, color: networkColors.node7, label: '' },
      { id: 'node-8', x: 160, y: 100, r: 23, color: networkColors.node8, label: '' },
      
      // Nombreux petits nœuds pour densité (labels vides)
      { id: 'small-1', x: 90, y: 50, r: 12, color: networkColors.node1, label: '' },
      { id: 'small-2', x: 150, y: 45, r: 10, color: networkColors.node1, label: '' },
      { id: 'small-3', x: 180, y: 60, r: 11, color: networkColors.node1, label: '' },
      { id: 'small-4', x: 340, y: 120, r: 14, color: networkColors.node3, label: '' },
      { id: 'small-5', x: 360, y: 180, r: 13, color: networkColors.node3, label: '' },
      { id: 'small-6', x: 250, y: 250, r: 12, color: networkColors.node4, label: '' },
      { id: 'small-7', x: 310, y: 240, r: 11, color: networkColors.node4, label: '' },
      { id: 'small-8', x: 170, y: 280, r: 13, color: networkColors.node5, label: '' },
      { id: 'small-9', x: 230, y: 290, r: 12, color: networkColors.node5, label: '' },
      { id: 'small-10', x: 90, y: 190, r: 11, color: networkColors.node6, label: '' },
      { id: 'small-11', x: 140, y: 250, r: 9, color: networkColors.node6, label: '' },
      { id: 'small-12', x: 130, y: 130, r: 13, color: networkColors.node8, label: '' },
      { id: 'small-13', x: 190, y: 120, r: 12, color: networkColors.node8, label: '' },
      
      // Plus de nœuds pour atteindre la densité
      { id: 'tiny-1', x: 50, y: 80, r: 10, color: networkColors.node1, label: '' },
      { id: 'tiny-2', x: 70, y: 110, r: 11, color: networkColors.node1, label: '' },
      { id: 'tiny-3', x: 40, y: 140, r: 8, color: networkColors.node1, label: '' },
      { id: 'tiny-4', x: 60, y: 170, r: 9, color: networkColors.node1, label: '' },
      { id: 'tiny-5', x: 80, y: 200, r: 10, color: networkColors.node6, label: '' },
      { id: 'tiny-6', x: 100, y: 260, r: 8, color: networkColors.node6, label: '' },
      { id: 'tiny-7', x: 300, y: 50, r: 14, color: networkColors.node5, label: '' },
      { id: 'tiny-8', x: 340, y: 80, r: 12, color: networkColors.node5, label: '' },
      { id: 'tiny-9', x: 370, y: 110, r: 11, color: networkColors.node5, label: '' },
      { id: 'tiny-10', x: 380, y: 150, r: 10, color: networkColors.node5, label: '' },
      { id: 'tiny-11', x: 360, y: 200, r: 9, color: networkColors.node5, label: '' },
      { id: 'tiny-12', x: 330, y: 270, r: 12, color: networkColors.node7, label: '' },
      { id: 'tiny-13', x: 290, y: 300, r: 10, color: networkColors.node7, label: '' },
      { id: 'tiny-14', x: 50, y: 200, r: 11, color: networkColors.node8, label: '' },
      { id: 'tiny-15', x: 30, y: 170, r: 9, color: networkColors.node8, label: '' },
      { id: 'tiny-16', x: 40, y: 240, r: 8, color: networkColors.node8, label: '' },
      { id: 'tiny-17', x: 220, y: 40, r: 12, color: networkColors.node2, label: '' },
      { id: 'tiny-18', x: 250, y: 70, r: 10, color: networkColors.node2, label: '' },
      { id: 'tiny-19', x: 310, y: 40, r: 11, color: networkColors.node2, label: '' },
      { id: 'tiny-20', x: 350, y: 60, r: 9, color: networkColors.node2, label: '' },
      { id: 'tiny-21', x: 380, y: 90, r: 10, color: networkColors.node2, label: '' },
      
      // Nœuds périphériques pour plus de densité
      { id: 'edge-1', x: 20, y: 100, r: 8, color: networkColors.node3, label: '' },
      { id: 'edge-2', x: 30, y: 130, r: 7, color: networkColors.node3, label: '' },
      { id: 'edge-3', x: 15, y: 200, r: 9, color: networkColors.node2, label: '' },
      { id: 'edge-4', x: 35, y: 270, r: 7, color: networkColors.node2, label: '' },
      { id: 'edge-5', x: 60, y: 300, r: 8, color: networkColors.node6, label: '' },
      { id: 'edge-6', x: 100, y: 320, r: 6, color: networkColors.node6, label: '' },
      { id: 'edge-7', x: 140, y: 310, r: 7, color: networkColors.node6, label: '' },
      { id: 'edge-8', x: 200, y: 320, r: 8, color: networkColors.node2, label: '' },
      { id: 'edge-9', x: 260, y: 310, r: 7, color: networkColors.node2, label: '' },
      { id: 'edge-10', x: 320, y: 300, r: 6, color: networkColors.node2, label: '' },
      { id: 'edge-11', x: 380, y: 250, r: 9, color: networkColors.node4, label: '' },
      { id: 'edge-12', x: 390, y: 200, r: 7, color: networkColors.node4, label: '' },
      { id: 'edge-13', x: 385, y: 130, r: 8, color: networkColors.node4, label: '' }
    ],
    links: [
      // Connexions du centre vers nœuds principaux
      { source: 'central', target: 'node-1' },
      { source: 'central', target: 'node-2' },
      { source: 'central', target: 'node-3' },
      { source: 'central', target: 'node-4' },
      { source: 'central', target: 'node-5' },
      { source: 'central', target: 'node-6' },
      { source: 'central', target: 'node-7' },
      { source: 'central', target: 'node-8' },
      
      // Connexions secondaires pour densité
      { source: 'node-1', target: 'small-1' },
      { source: 'node-1', target: 'small-2' },
      { source: 'node-2', target: 'small-3' },
      { source: 'node-3', target: 'small-4' },
      { source: 'node-3', target: 'small-5' },
      { source: 'node-4', target: 'small-6' },
      { source: 'node-4', target: 'small-7' },
      { source: 'node-5', target: 'small-8' },
      { source: 'node-5', target: 'small-9' },
      { source: 'node-6', target: 'small-10' },
      { source: 'node-6', target: 'small-11' },
      { source: 'node-8', target: 'small-12' },
      { source: 'node-8', target: 'small-13' },
      
      // Quelques connexions tertiaires
      { source: 'small-1', target: 'tiny-1' },
      { source: 'small-4', target: 'tiny-7' },
      { source: 'small-8', target: 'tiny-12' },
      { source: 'small-2', target: 'tiny-17' },
      { source: 'node-7', target: 'edge-1' }
    ]
  };

  // Données DENSES pour le ranking (comme vrai Handshake)
  const rankingData = [
    { name: 'Michael Nelson', score: '34.27%', status: 'positive', color: 'text-green-400' },
    { name: 'Christopher Lee', score: '28.15%', status: 'negative', color: 'text-red-400' },
    { name: 'Jessica Packett', score: '26.33%', status: 'positive', color: 'text-green-400' },
    { name: 'Matthew Song', score: '24.28%', status: 'positive', color: 'text-green-400' },
    { name: 'Ashley Hamilton', score: '22.06%', status: 'negative', color: 'text-red-400' },
    { name: 'Jennifer Bender', score: '21.67%', status: 'positive', color: 'text-green-400' },
    { name: 'Joshua Wagner', score: '20.89%', status: 'negative', color: 'text-red-400' },
    { name: 'Amanda McLaughlin', score: '19.42%', status: 'positive', color: 'text-green-400' },
    { name: 'Daniel McNamara', score: '18.55%', status: 'negative', color: 'text-red-400' },
    { name: 'David Raynor', score: '17.91%', status: 'negative', color: 'text-red-400' },
    { name: 'James Nixon', score: '16.25%', status: 'negative', color: 'text-red-400' },
    { name: 'Robert Woolard', score: '15.67%', status: 'positive', color: 'text-green-400' },
    { name: 'John Desai', score: '14.12%', status: 'negative', color: 'text-red-400' },
    { name: 'Joseph Wallace', score: '13.75%', status: 'negative', color: 'text-red-400' },
    { name: 'Andrew Lawrence', score: '12.23%', status: 'positive', color: 'text-green-400' },
    { name: 'Ryan Griffin', score: '11.44%', status: 'negative', color: 'text-red-400' },
    { name: 'Brandon Dougherty', score: '10.95%', status: 'negative', color: 'text-red-400' },
    { name: 'Jason Powers', score: '10.16%', status: 'positive', color: 'text-green-400' },
    { name: 'Justin May', score: '9.28%', status: 'positive', color: 'text-green-400' },
    { name: 'Sarah Steele', score: '8.19%', status: 'negative', color: 'text-red-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white">
      {/* Header exactement comme Handshake */}
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center px-6 py-3 bg-black/60 backdrop-blur-md border-b border-gray-800/50"
      >
        {/* Logo et navigation gauche */}
        <div className="flex items-center space-x-6">
          {/* Menu Hamburger */}
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-slate-900/95 backdrop-blur-md border-gray-800 w-80">
              <div className="flex flex-col space-y-1 mt-8">
                {sidebarTabs.map((tab, i) => (
                  <Button
                    key={i}
                    variant={activeTab === i ? "default" : "ghost"}
                    className="justify-start text-left w-full h-12 px-4"
                    onClick={() => {
                      setActiveTab(i);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <span className="mr-3 text-lg">{tab.icon}</span>
                    {tab.name}
                  </Button>
                ))}
                <hr className="border-gray-700 my-4" />
                <Button
                  variant="ghost"
                  className="justify-start text-left w-full h-10 px-4"
                  onClick={() => {
                    setIsTaskbarOpen(!isTaskbarOpen);
                    setIsSidebarOpen(false);
                  }}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Barre de Tâches
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">Dashboard</h1>
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <span>Gestion Projets</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Centre - Filtres */}
        <div className="hidden lg:flex items-center space-x-6">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white h-8">
            <Filter className="h-4 w-4 mr-2" />
            Statut
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white h-8">
            <Calendar className="h-4 w-4 mr-2" />
            Date
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white h-8">
            <Wrench className="h-4 w-4 mr-2" />
            Outil
          </Button>
          <span className="text-sm text-gray-400">Ranking Projets</span>
        </div>

        {/* Droite - User et actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Info className="h-4 w-4" />
            </Button>
          </div>

          {/* User info */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-medium">Admin User</p>
              <p className="text-gray-400 text-xs">Project Manager</p>
            </div>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
            </Button>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-sm">
            Action
          </Button>
        </div>
      </motion.div>

      {/* Barre de tâches slide */}
      <AnimatePresence>
        {isTaskbarOpen && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="bg-black/90 backdrop-blur-sm border-b border-gray-800/50 px-6 py-2"
          >
            <div className="flex justify-around text-xs">
              {taskbarMenus.map((menu, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="font-medium text-gray-300">{menu.name}:</span>
                  <span className="text-gray-400">{menu.items.slice(0,3).join(', ')}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout principal - 3 colonnes comme Handshake */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar gauche - Liste connexions/événements */}
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="hidden lg:block w-64 bg-black/30 backdrop-blur-sm border-r border-gray-800/50 p-4"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-3">Projets Récents</h3>
              <div className="space-y-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800/30 cursor-pointer">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm">Projet Exemple {i}</p>
                      <p className="text-gray-500 text-xs">Aucun projet créé</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-3">Notifications</h3>
              <div className="space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="p-2 bg-gray-800/20 rounded text-xs">
                    <p className="text-gray-400">Notification {i}</p>
                    <p className="text-gray-500">Aucune notification</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Zone centrale - Graph réseau + contenu onglet */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Graph réseau central */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50"
            >
              <div className="relative w-full h-80 overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 400 320">
                  <Group>
                    {/* Connexions */}
                    {networkData.links.map((link, i) => {
                      const sourceNode = networkData.nodes.find(n => n.id === link.source);
                      const targetNode = networkData.nodes.find(n => n.id === link.target);
                      return (
                        <line
                          key={i}
                          x1={sourceNode.x}
                          y1={sourceNode.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke="rgba(255,255,255,0.15)"
                          strokeWidth={1}
                        />
                      );
                    })}
                    
                    {/* Nœuds */}
                    {networkData.nodes.map((node, i) => (
                      <g key={i}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.r}
                          fill={node.color}
                          opacity={0.9}
                          className="cursor-pointer hover:opacity-100"
                        />
                        <text
                          x={node.x}
                          y={node.y + node.r + 12}
                          textAnchor="middle"
                          className="fill-gray-300 text-xs font-medium"
                        >
                          {node.label.split('\n')[0]}
                        </text>
                        {node.label.includes('\n') && (
                          <text
                            x={node.x}
                            y={node.y + node.r + 24}
                            textAnchor="middle"
                            className="fill-gray-400 text-xs"
                          >
                            {node.label.split('\n')[1]}
                          </text>
                        )}
                      </g>
                    ))}
                  </Group>
                </svg>
                
                {/* Invite centrale */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-gray-300 mb-3">Crée un nouveau projet</p>
                    <Button className="pointer-events-auto bg-blue-600 hover:bg-blue-700">
                      Commencer
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contenu de l'onglet actif */}
            <motion.div
              key={activeTab}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50"
            >
              {sidebarTabs[activeTab].content}
            </motion.div>
          </div>
        </div>

        {/* Panneau droit - Métriques et ranking */}
        <motion.div 
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden xl:block w-80 bg-black/30 backdrop-blur-sm border-l border-gray-800/50 p-4"
        >
          <div className="space-y-6">
            {/* Métriques du haut */}
            <div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-xs text-gray-400">Overall</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">0</p>
                  <p className="text-xs text-gray-400">Prestige</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <p className="text-green-400 font-bold">0%</p>
                  <p className="text-gray-500">Success</p>
                </div>
                <div>
                  <p className="text-blue-400 font-bold">0%</p>
                  <p className="text-gray-500">Progress</p>
                </div>
                <div>
                  <p className="text-yellow-400 font-bold">0%</p>
                  <p className="text-gray-500">Innovation</p>
                </div>
                <div>
                  <p className="text-purple-400 font-bold">0%</p>
                  <p className="text-gray-500">Impact</p>
                </div>
              </div>
            </div>

            {/* Graph de performance */}
            <div>
              <div className="bg-black/50 rounded-lg p-4 mb-4">
                <div className="w-full h-32 bg-gradient-to-t from-green-900/20 to-green-600/20 rounded flex items-end justify-center">
                  <p className="text-gray-500 text-sm">Performance Graph (Vide)</p>
                </div>
              </div>
            </div>

            {/* My Topics */}
            <div>
              <h3 className="text-white font-medium mb-3">Mes Projets</h3>
              <div className="space-y-2">
                {['Développement Web', 'Design UI/UX', 'Marketing Digital', 'Analytics', 'DevOps'].map((topic, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-300">{topic}</span>
                    <span className="text-gray-500">0%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* My Connections */}
            <div>
              <h3 className="text-white font-medium mb-3">Mes Outils</h3>
              <div className="space-y-2">
                {['GitHub', 'Figma', 'Notion', 'YouTube', 'Analytics'].map((tool, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                    <span className="text-gray-300 text-sm">{tool}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ranking DENSE comme Handshake */}
            <div>
              <h3 className="text-white font-medium mb-3">Influence Ranking</h3>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {rankingData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-black/30 rounded text-sm hover:bg-black/40">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-xs w-6">#{i + 1}</span>
                      <span className="text-gray-300 text-xs">{item.name}</span>
                    </div>
                    <span className={`text-xs font-medium ${item.color}`}>{item.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}