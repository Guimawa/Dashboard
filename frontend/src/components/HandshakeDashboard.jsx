import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network } from '@visx/network';
import { Group } from '@visx/group';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Bell, Menu, Filter, Calendar, Wrench, ChevronDown, Star, Share, Info, User, Settings } from 'lucide-react';

// Couleurs exactes du design Handshake
const networkColors = {
  central: '#00BFFF',     // Bleu cyan central
  node1: '#10B981',       // Vert
  node2: '#F59E0B',       // Orange/Jaune  
  node3: '#EF4444',       // Rouge
  node4: '#8B5CF6',       // Violet
  node5: '#06B6D4',       // Cyan
  node6: '#F97316',       // Orange
  node7: '#84CC16',       // Lime
  node8: '#EC4899'        // Pink
};

// Onglets sidebar (adaptés au projet)
const sidebarTabs = [
  { 
    name: 'New Projet', 
    icon: '📋',
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Créer un Nouveau Projet</h3>
          <p className="text-gray-400 text-sm">Formulaire vide pour initialiser un projet</p>
        </div>
        <div className="space-y-4">
          <div className="bg-slate-800/30 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-2">Nom du projet</p>
            <div className="w-full h-10 bg-slate-700/50 rounded border border-gray-600"></div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-2">Description</p>
            <div className="w-full h-20 bg-slate-700/50 rounded border border-gray-600"></div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Créer le projet
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
          <p className="text-gray-400 text-sm">Zone de saisie vide pour idées et synthèse IA</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4">
          <p className="text-gray-300 text-sm mb-2">Décris ton idée ou problème</p>
          <div className="w-full h-32 bg-slate-700/50 rounded border border-gray-600 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Commence par écrire ton idée ici...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/30 rounded p-3 text-center">
            <p className="text-xs text-gray-400">GPT-4 Response</p>
            <p className="text-gray-500 text-xs mt-1">Vide</p>
          </div>
          <div className="bg-slate-800/30 rounded p-3 text-center">
            <p className="text-xs text-gray-400">Claude Response</p>
            <p className="text-gray-500 text-xs mt-1">Vide</p>
          </div>
          <div className="bg-slate-800/30 rounded p-3 text-center">
            <p className="text-xs text-gray-400">Gemini Response</p>
            <p className="text-gray-500 text-xs mt-1">Vide</p>
          </div>
          <div className="bg-slate-800/30 rounded p-3 text-center">
            <p className="text-xs text-gray-400">Synthèse</p>
            <p className="text-gray-500 text-xs mt-1">Vide</p>
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
          <h3 className="text-xl font-semibold text-white mb-2">Coffre-fort Sécurisé</h3>
          <p className="text-gray-400 text-sm">Stockage chiffré AES pour clés API/mots de passe</p>
        </div>
        <div className="space-y-3">
          {['OpenAI API', 'GitHub Token', 'Figma Token', 'Notion API', 'YouTube API'].map((service, i) => (
            <div key={i} className="bg-slate-800/30 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-gray-300 text-sm">{service}</p>
                <p className="text-gray-500 text-xs">Non configuré</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                Ajouter
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
          <p className="text-gray-400 text-sm">Vue globale : en cours/bloqué/terminé</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-3 text-center">
            <p className="text-green-400 text-2xl font-bold">0</p>
            <p className="text-green-300 text-xs">En cours</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 text-center">
            <p className="text-yellow-400 text-2xl font-bold">0</p>
            <p className="text-yellow-300 text-xs">Bloqués</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 text-center">
            <p className="text-blue-400 text-2xl font-bold">0</p>
            <p className="text-blue-300 text-xs">Terminés</p>
          </div>
        </div>
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="bg-slate-800/30 rounded p-3 flex justify-between">
              <div>
                <p className="text-gray-300 text-sm">Projet {i}</p>
                <p className="text-gray-500 text-xs">Aucun projet créé</p>
              </div>
              <div className="text-gray-500 text-xs">
                Status: Vide
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
          <h3 className="text-xl font-semibold text-white mb-2">Analytics & Métriques</h3>
          <p className="text-gray-400 text-sm">Graphs dynamiques vues/users, export PDF/CSV</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4">
          <p className="text-gray-300 text-sm mb-3">Performance Overview</p>
          <div className="w-full h-32 bg-slate-700/30 rounded flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Graph vide</p>
              <p className="text-gray-600 text-xs">Connectez vos données</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/30 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Vues YouTube</p>
            <p className="text-white text-lg font-bold">0</p>
          </div>
          <div className="bg-slate-800/30 rounded p-3 text-center">
            <p className="text-gray-400 text-xs">Users Actifs</p>
            <p className="text-white text-lg font-bold">0</p>
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

  // Graph réseau DENSE comme vrai Handshake Influence (50+ nœuds)
  const networkData = {
    nodes: [
      // Nœud central gros
      { id: 'central', x: 200, y: 150, r: 35, color: networkColors.central, label: 'Dashboard Central' },
      
      // Nœuds principaux moyens (rayons du centre)
      { id: 'web-dev', x: 120, y: 80, r: 28, color: networkColors.node1, label: 'Web Dev' },
      { id: 'mobile-app', x: 280, y: 80, r: 26, color: networkColors.node2, label: 'Mobile App' },
      { id: 'backend', x: 320, y: 150, r: 30, color: networkColors.node3, label: 'Backend' },
      { id: 'database', x: 280, y: 220, r: 24, color: networkColors.node4, label: 'Database' },
      { id: 'devops', x: 200, y: 260, r: 27, color: networkColors.node5, label: 'DevOps' },
      { id: 'design-ui', x: 120, y: 220, r: 25, color: networkColors.node6, label: 'UI Design' },
      { id: 'api-rest', x: 80, y: 150, r: 22, color: networkColors.node7, label: 'REST API' },
      { id: 'ai-tools', x: 160, y: 100, r: 23, color: networkColors.node8, label: 'AI Tools' },
      
      // Nombreux petits nœuds satellites (comme vrai Handshake)
      { id: 'react', x: 90, y: 50, r: 12, color: networkColors.node1, label: 'React' },
      { id: 'vue', x: 150, y: 45, r: 10, color: networkColors.node1, label: 'Vue' },
      { id: 'angular', x: 180, y: 60, r: 11, color: networkColors.node1, label: 'Angular' },
      { id: 'nodejs', x: 340, y: 120, r: 14, color: networkColors.node3, label: 'Node.js' },
      { id: 'python', x: 360, y: 180, r: 13, color: networkColors.node3, label: 'Python' },
      { id: 'mongodb', x: 250, y: 250, r: 12, color: networkColors.node4, label: 'MongoDB' },
      { id: 'postgresql', x: 310, y: 240, r: 11, color: networkColors.node4, label: 'PostgreSQL' },
      { id: 'docker', x: 170, y: 280, r: 13, color: networkColors.node5, label: 'Docker' },
      { id: 'kubernetes', x: 230, y: 290, r: 12, color: networkColors.node5, label: 'K8s' },
      { id: 'figma', x: 90, y: 190, r: 11, color: networkColors.node6, label: 'Figma' },
      { id: 'sketch', x: 140, y: 250, r: 9, color: networkColors.node6, label: 'Sketch' },
      { id: 'openai', x: 130, y: 130, r: 13, color: networkColors.node8, label: 'OpenAI' },
      { id: 'claude', x: 190, y: 120, r: 12, color: networkColors.node8, label: 'Claude' },
      
      // Plus de nœuds pour densité
      { id: 'typescript', x: 50, y: 80, r: 10, color: networkColors.node1, label: 'TS' },
      { id: 'javascript', x: 70, y: 110, r: 11, color: networkColors.node1, label: 'JS' },
      { id: 'html', x: 40, y: 140, r: 8, color: networkColors.node1, label: 'HTML' },
      { id: 'css', x: 60, y: 170, r: 9, color: networkColors.node1, label: 'CSS' },
      { id: 'tailwind', x: 80, y: 200, r: 10, color: networkColors.node6, label: 'Tailwind' },
      { id: 'bootstrap', x: 100, y: 260, r: 8, color: networkColors.node6, label: 'Bootstrap' },
      { id: 'aws', x: 300, y: 50, r: 14, color: networkColors.node5, label: 'AWS' },
      { id: 'gcp', x: 340, y: 80, r: 12, color: networkColors.node5, label: 'GCP' },
      { id: 'azure', x: 370, y: 110, r: 11, color: networkColors.node5, label: 'Azure' },
      { id: 'vercel', x: 380, y: 150, r: 10, color: networkColors.node5, label: 'Vercel' },
      { id: 'netlify', x: 360, y: 200, r: 9, color: networkColors.node5, label: 'Netlify' },
      { id: 'github', x: 330, y: 270, r: 12, color: networkColors.node7, label: 'GitHub' },
      { id: 'gitlab', x: 290, y: 300, r: 10, color: networkColors.node7, label: 'GitLab' },
      { id: 'notion', x: 50, y: 200, r: 11, color: networkColors.node8, label: 'Notion' },
      { id: 'slack', x: 30, y: 170, r: 9, color: networkColors.node8, label: 'Slack' },
      { id: 'discord', x: 40, y: 240, r: 8, color: networkColors.node8, label: 'Discord' },
      { id: 'youtube', x: 220, y: 40, r: 12, color: networkColors.node2, label: 'YouTube' },
      { id: 'tiktok', x: 250, y: 70, r: 10, color: networkColors.node2, label: 'TikTok' },
      { id: 'instagram', x: 310, y: 40, r: 11, color: networkColors.node2, label: 'Instagram' },
      { id: 'twitter', x: 350, y: 60, r: 9, color: networkColors.node2, label: 'Twitter' },
      { id: 'linkedin', x: 380, y: 90, r: 10, color: networkColors.node2, label: 'LinkedIn' },
      
      // Nœuds périphériques pour plus de densité
      { id: 'analytics', x: 20, y: 100, r: 8, color: networkColors.node3, label: 'Analytics' },
      { id: 'seo', x: 30, y: 130, r: 7, color: networkColors.node3, label: 'SEO' },
      { id: 'marketing', x: 15, y: 200, r: 9, color: networkColors.node2, label: 'Marketing' },
      { id: 'copywriting', x: 35, y: 270, r: 7, color: networkColors.node2, label: 'Copy' },
      { id: 'branding', x: 60, y: 300, r: 8, color: networkColors.node6, label: 'Brand' },
      { id: 'logo-design', x: 100, y: 320, r: 6, color: networkColors.node6, label: 'Logo' },
      { id: 'photography', x: 140, y: 310, r: 7, color: networkColors.node6, label: 'Photo' },
      { id: 'video-edit', x: 200, y: 320, r: 8, color: networkColors.node2, label: 'Video' },
      { id: 'animation', x: 260, y: 310, r: 7, color: networkColors.node2, label: 'Anim' },
      { id: 'motion', x: 320, y: 300, r: 6, color: networkColors.node2, label: 'Motion' },
      { id: 'testing', x: 380, y: 250, r: 9, color: networkColors.node4, label: 'Testing' },
      { id: 'qa', x: 390, y: 200, r: 7, color: networkColors.node4, label: 'QA' },
      { id: 'security', x: 385, y: 130, r: 8, color: networkColors.node4, label: 'Security' }
    ],
    links: [
      // Connexions du centre vers nœuds principaux
      { source: 'central', target: 'web-dev' },
      { source: 'central', target: 'mobile-app' },
      { source: 'central', target: 'backend' },
      { source: 'central', target: 'database' },
      { source: 'central', target: 'devops' },
      { source: 'central', target: 'design-ui' },
      { source: 'central', target: 'api-rest' },
      { source: 'central', target: 'ai-tools' },
      
      // Connexions des nœuds principaux vers satellites
      { source: 'web-dev', target: 'react' },
      { source: 'web-dev', target: 'vue' },
      { source: 'web-dev', target: 'angular' },
      { source: 'web-dev', target: 'typescript' },
      { source: 'web-dev', target: 'javascript' },
      { source: 'backend', target: 'nodejs' },
      { source: 'backend', target: 'python' },
      { source: 'database', target: 'mongodb' },
      { source: 'database', target: 'postgresql' },
      { source: 'devops', target: 'docker' },
      { source: 'devops', target: 'kubernetes' },
      { source: 'devops', target: 'aws' },
      { source: 'design-ui', target: 'figma' },
      { source: 'design-ui', target: 'sketch' },
      { source: 'design-ui', target: 'tailwind' },
      { source: 'ai-tools', target: 'openai' },
      { source: 'ai-tools', target: 'claude' },
      { source: 'ai-tools', target: 'notion' },
      
      // Connexions secondaires pour plus de densité
      { source: 'react', target: 'typescript' },
      { source: 'nodejs', target: 'mongodb' },
      { source: 'docker', target: 'aws' },
      { source: 'figma', target: 'tailwind' },
      { source: 'github', target: 'vercel' },
      { source: 'mobile-app', target: 'youtube' },
      { source: 'marketing', target: 'instagram' },
      { source: 'backend', target: 'security' },
      { source: 'database', target: 'testing' }
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

            {/* Ranking */}
            <div>
              <h3 className="text-white font-medium mb-3">Influence Ranking</h3>
              <div className="space-y-1">
                {rankingData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-black/30 rounded text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-xs">#{i + 1}</span>
                      <span className="text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-gray-500 text-xs">{item.score}</span>
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