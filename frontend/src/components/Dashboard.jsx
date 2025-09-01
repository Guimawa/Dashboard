import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network } from '@visx/network';
import { Group } from '@visx/group';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Bell, Menu, Filter, Calendar, Wrench } from 'lucide-react';

// Couleurs spécifiques pour les bulles
const bubbleColors = {
  blue: '#3B82F6',
  green: '#10B981', 
  red: '#EF4444',
  yellow: '#F59E0B',
  violet: '#8B5CF6',
  cyan: '#06B6D4'
};

// Onglets de la sidebar
const sidebarTabs = [
  { 
    name: 'New Projet', 
    content: (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-white">Nouveau Projet</h3>
        <p className="text-gray-300">Formulaire vide pour créer un projet.</p>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Commencer un projet
        </Button>
      </div>
    )
  },
  { 
    name: 'Table Ronde IA', 
    content: (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-white">Brainstorm IA</h3>
        <p className="text-gray-300">Zone de saisie vide pour brainstorm.</p>
        <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Décris ton idée ici...</p>
        </div>
      </div>
    )
  },
  { 
    name: 'Outils (Keys API, etc.)', 
    content: (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-white">Coffre-fort API</h3>
        <p className="text-gray-300">Coffre-fort vide. Ajoute des clés sécurisées.</p>
        <Button variant="outline" className="w-full">
          + Ajouter une clé API
        </Button>
      </div>
    )
  },
  { 
    name: 'Vue d\'ensemble', 
    content: (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-white">Vue d'ensemble</h3>
        <p className="text-gray-300">Graph réseau vide. Crée un projet pour remplir.</p>
        <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Aucun projet connecté</p>
        </div>
      </div>
    )
  },
  { 
    name: 'Suivi performances', 
    content: (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-white">Métriques</h3>
        <p className="text-gray-300">Graphs vides pour métriques. Connecte des données.</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">0</p>
            <p className="text-xs text-gray-400">Projets actifs</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">0%</p>
            <p className="text-xs text-gray-400">Completion</p>
          </div>
        </div>
      </div>
    )
  }
];

// Menu classique pour la barre de tâches
const taskbarMenus = [
  {
    name: 'Fichier',
    items: ['Nouveau', 'Ouvrir', 'Sauvegarder', 'Exporter']
  },
  {
    name: 'Édition', 
    items: ['Copier', 'Coller', 'Annuler', 'Refaire']
  },
  {
    name: 'Affichage',
    items: ['Zoom +', 'Zoom -', 'Plein écran', 'Miniature']
  },
  {
    name: 'Aide',
    items: ['Support', 'Documentation', 'À propos']
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskbarOpen, setIsTaskbarOpen] = useState(false);

  // Graph réseau avec bulles placeholder (5-6 bulles différentes couleurs)
  const graphData = {
    nodes: [
      { id: 'center', x: 200, y: 150, r: 35, color: bubbleColors.blue, label: 'Projet Central' },
      { id: 'node1', x: 100, y: 80, r: 25, color: bubbleColors.green, label: 'Idée 1' },
      { id: 'node2', x: 300, y: 80, r: 25, color: bubbleColors.red, label: 'Idée 2' },
      { id: 'node3', x: 80, y: 220, r: 20, color: bubbleColors.yellow, label: 'Concept' },
      { id: 'node4', x: 320, y: 220, r: 20, color: bubbleColors.violet, label: 'Vision' },
      { id: 'node5', x: 200, y: 280, r: 22, color: bubbleColors.cyan, label: 'Stratégie' }
    ],
    links: [
      { source: 'center', target: 'node1' },
      { source: 'center', target: 'node2' },
      { source: 'center', target: 'node3' },
      { source: 'center', target: 'node4' },
      { source: 'center', target: 'node5' }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white flex flex-col">
      {/* Top Bar avec filtres et notifications */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center p-4 bg-black/50 backdrop-blur-sm border-b border-gray-800"
      >
        <div className="flex space-x-6 items-center">
          {/* Menu Hamburger */}
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-slate-900/95 backdrop-blur-md border-gray-800 w-80">
              <div className="flex flex-col space-y-4 mt-6">
                {sidebarTabs.map((tab, i) => (
                  <Button
                    key={i}
                    variant={activeTab === i ? "default" : "ghost"}
                    className="justify-start text-left w-full"
                    onClick={() => {
                      setActiveTab(i);
                      setIsSidebarOpen(false);
                    }}
                  >
                    {tab.name}
                  </Button>
                ))}
                <hr className="border-gray-700 my-4" />
                <Button
                  variant="ghost"
                  className="justify-start text-left w-full"
                  onClick={() => {
                    setIsTaskbarOpen(!isTaskbarOpen);
                    setIsSidebarOpen(false);
                  }}
                >
                  Menu Classique
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Filtres Top Bar */}
          <div className="hidden md:flex space-x-4 items-center">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Filter className="h-4 w-4 mr-2" />
              Statut
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Date
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Wrench className="h-4 w-4 mr-2" />
              Outil
            </Button>
          </div>

          <div className="hidden md:block">
            <span className="text-sm text-gray-400">Ranking Projets</span>
          </div>
        </div>

        {/* Bulle notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          </Button>
        </div>
      </motion.div>

      {/* Barre de tâches slide (masquée par défaut) */}
      <AnimatePresence>
        {isTaskbarOpen && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="bg-black/80 backdrop-blur-sm border-b border-gray-800 px-4 py-2"
          >
            <div className="flex justify-around text-sm">
              {taskbarMenus.map((menu, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="font-medium text-gray-300">{menu.name}:</span>
                  <span className="text-gray-400">{menu.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <div className="flex-1 flex">
        {/* Zone centrale avec graph et contenu d'onglet */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Graph réseau central */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-8"
            >
              <div className="relative w-full h-96 overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 400 300">
                  <Group>
                    {/* Liens */}
                    {graphData.links.map((link, i) => {
                      const sourceNode = graphData.nodes.find(n => n.id === link.source);
                      const targetNode = graphData.nodes.find(n => n.id === link.target);
                      return (
                        <line
                          key={i}
                          x1={sourceNode.x}
                          y1={sourceNode.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth={1}
                        />
                      );
                    })}
                    
                    {/* Nœuds */}
                    {graphData.nodes.map((node, i) => (
                      <g key={i}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.r}
                          fill={node.color}
                          opacity={0.8}
                          className="cursor-pointer hover:opacity-100"
                        />
                        <text
                          x={node.x}
                          y={node.y + node.r + 15}
                          textAnchor="middle"
                          className="fill-gray-300 text-xs"
                        >
                          {node.label}
                        </text>
                      </g>
                    ))}
                  </Group>
                </svg>
                
                {/* Invite centrale */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-lg text-gray-300 mb-4">Invite: Crée un nouveau projet</p>
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
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-black/30 backdrop-blur-sm rounded-2xl p-8"
            >
              {sidebarTabs[activeTab].content}
            </motion.div>
          </div>
        </div>

        {/* Sidebar droite - Ranking vide */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden lg:block w-80 p-6 bg-black/20 backdrop-blur-sm border-l border-gray-800"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Mes Connexions</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Connexion {i}</p>
                      <p className="text-xs text-gray-500">Vide</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Influence Ranking</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">#{i}</span>
                      <span className="text-sm text-gray-300">Projet {i}</span>
                    </div>
                    <span className="text-xs text-gray-500">0.0%</span>
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