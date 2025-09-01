
import React, { useState } from 'react';
import { XIcon, SparklesIcon, BrainIcon, WandIcon, BookOpenIcon, ChatBubbleIcon, DocumentTextIcon, ChevronLeftIcon, MenuIcon } from './icons';

const FeaturesSection: React.FC = () => {
    const AgentFeatureCard: React.FC<{
        icon: React.ReactNode;
        title: string;
        isBeta?: boolean;
        children: React.ReactNode;
    }> = ({ icon, title, isBeta, children }) => (
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition-all duration-300">
        <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            {icon}
            </div>
            <div>
            <div className="flex items-center gap-2">
                <h4 className="text-xl font-bold text-gray-800">{title}</h4>
                {isBeta && <span className="text-xs bg-indigo-100 text-indigo-700 font-medium px-2 py-0.5 rounded-full">Beta</span>}
            </div>
            </div>
        </div>
        <p className="text-gray-600 leading-relaxed">{children}</p>
        </div>
    );

    const OtherFeature: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{children}</p>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-300">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">Features</h2>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">Agent Types</h3>
            <p className="text-gray-600 leading-relaxed mb-6">Silo Search offers multiple AI agents, each tailored for specific tasks. You can switch between them at any time using the "Agent" button on the home page.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <AgentFeatureCard icon={<ChatBubbleIcon className="w-6 h-6"/>} title="S1 Mini">
                  Our new flagship model. It intelligently handles any query, combining powerful search with a seamless conversational experience. The perfect balance of speed, power, and chat.
                </AgentFeatureCard>
                <AgentFeatureCard icon={<BrainIcon className="w-6 h-6"/>} title="Deep Research">
                  Performs an in-depth analysis of a topic. This agent provides a comprehensive answer by exploring multiple sources and concepts, showing you its progress in real-time.
                </AgentFeatureCard>
                <AgentFeatureCard icon={<WandIcon className="w-6 h-6"/>} title="Creative Agent">
                  Your partner for generation. This agent can write code, create documents, draft presentation slides, build forms, and more. It now has a dedicated creative workspace to show its progress.
                </AgentFeatureCard>
            </div>

            <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Models (2026)</h3>
                <p className="text-gray-600 leading-relaxed mb-6">We're constantly innovating. Get ready for the next generation of AI models, designed to push the boundaries of speed, intelligence, and capability.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-800">S2 Mini</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-800">S2 Mini Flash</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-800">S2 Flash</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-800">S2 Mini Pro</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-800">S2 Pro</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-800">S2 Ultra</p>
                    </div>
                </div>
            </div>

            <OtherFeature title="Chat Mode">
                After receiving a result, you can click the "Chat" button in the search bar to enter a conversational mode. This allows you to ask follow-up questions and interact with the AI in a continuous dialogue, building upon the initial search context.
            </OtherFeature>
            <OtherFeature title="Multi-modal Search">
                Go beyond text. You can upload an image (using the '+' button) along with a text prompt to perform a visual search. The AI will analyze the image and answer your question about it.
            </OtherFeature>
            <OtherFeature title="Silo Gen AI">
                For most web searches, Silo will automatically generate three unique, high-quality images based on your query. These images provide a visual interpretation of the search results, adding a rich, multi-modal layer to your answer.
            </OtherFeature>
            <OtherFeature title="Global Stop Button">
                During any AI operation (browsing, generating, etc.), a "Stop" button will appear in the bottom-right corner. You can click this at any time to cancel the current task and return to the home screen.
            </OtherFeature>
        </div>
    );
};

const ReleaseNotesSection: React.FC = () => {
    const ReleaseNote: React.FC<{ version: string; title: string; children: React.ReactNode }> = ({ version, title, children }) => (
        <div className="mb-12 relative">
            <div className="absolute -left-[42px] top-1.5 w-5 h-5 bg-white border-4 border-indigo-500 rounded-full"></div>
            <p className="text-sm font-semibold text-indigo-600 mb-1">{version}</p>
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            <div className="mt-3 text-gray-600 prose max-w-none prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-2">
                {children}
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-300">
            <h2 className="text-4xl font-bold text-gray-900 mb-10 border-b pb-4">Release Notes</h2>
            <div className="relative pl-10">
                <div className="absolute left-2.5 top-0 bottom-0 w-1 bg-gray-200 rounded-full"></div>
                
                <ReleaseNote version="v2.1" title="The Flagship Release">
                    <ul>
                        <li><strong>New Flagship Model:</strong> Introduced S1 Mini as the new primary agent, replacing Agent 3.0. S1 Mini offers the best balance of speed and power for search, and provides a seamless transition into chat.</li>
                        <li><strong>UI Simplification:</strong> The agent selection has been streamlined to focus on the new S1 Mini and specialized agents.</li>
                    </ul>
                </ReleaseNote>
                <ReleaseNote version="v2.0" title="The Conversational Update">
                    <ul>
                        <li><strong>New Feature:</strong> Introduced "Chat Mode" to allow for follow-up questions and conversational search.</li>
                        <li><strong>New Feature:</strong> Added a global "Stop" button to cancel any ongoing AI task.</li>
                        <li><strong>New Feature:</strong> Created a dedicated loading view for the Creative Agent.</li>
                        <li><strong>UI Improvement:</strong> Added modern, styled code blocks with a "Copy" button for all generated code.</li>
                    </ul>
                </ReleaseNote>
                <ReleaseNote version="v1.9" title="Creative Agent & Docs">
                    <ul>
                        <li><strong>New Feature:</strong> Added "Creative Agent" for generating code, documents, and more.</li>
                        <li><strong>New Feature:</strong> Added this comprehensive Docs page with feature guides and release notes.</li>
                        <li><strong>UI Improvement:</strong> Redesigned browsing tabs to be floating and fully-rounded.</li>
                        <li><strong>UI Improvement:</strong> Reduced the size of generated images on the results page for a more compact layout.</li>
                    </ul>
                </ReleaseNote>
                <ReleaseNote version="v1.8" title="Agent 3.0 (Beta)">
                    <p>Launched an intelligent agent that automatically selects the best model (Fast or Pro) based on query complexity.</p>
                </ReleaseNote>
            </div>
        </div>
    );
};

const PrivacySection: React.FC = () => (
    <div className="animate-in fade-in duration-300">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">Privacy Policy</h2>
        <div className="prose max-w-none text-gray-600 space-y-4">
            <p>Last updated: July 25, 2024</p>
            <p>Your privacy is important to us. It is Wolfsi Dev Studios' policy to respect your privacy regarding any information we may collect from you across our application.</p>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
            <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification. Customization settings are stored locally on your device and are not transmitted to our servers.</p>
            <p>We don’t share any personally identifying information publicly or with third-parties, except when required to by law.</p>
        </div>
    </div>
);

const TermsSection: React.FC = () => (
    <div className="animate-in fade-in duration-300">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">Terms of Service</h2>
        <div className="prose max-w-none text-gray-600 space-y-4">
            <p>By accessing this application, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this application are protected by applicable copyright and trademark law.</p>
            <p>Permission is granted to temporarily use the application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose, or for any public display (commercial or non-commercial); attempt to decompile or reverse engineer any software contained on this application; remove any copyright or other proprietary notations from the materials; or transfer the materials to another person or "mirror" the materials on any other server.</p>
        </div>
    </div>
);

const SECTIONS = [
  { id: 'features', label: 'Features', icon: SparklesIcon, component: FeaturesSection },
  { id: 'release_notes', label: 'Release Notes', icon: BookOpenIcon, component: ReleaseNotesSection },
  { id: 'privacy', label: 'Privacy Policy', icon: DocumentTextIcon, component: PrivacySection },
  { id: 'terms', label: 'Terms of Service', icon: DocumentTextIcon, component: TermsSection },
];
type SectionId = typeof SECTIONS[number]['id'];

const DocsView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<SectionId>('features');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const ActiveComponent = SECTIONS.find(s => s.id === activeSection)?.component || (() => null);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in fade-in duration-300">
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors" title="Toggle sidebar">
                    {isSidebarOpen ? <ChevronLeftIcon className="w-5 h-5"/> : <MenuIcon className="w-5 h-5"/>}
                </button>
                 <h1 className="text-2xl font-bold text-gray-800">Documentation</h1>
            </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors" title="Close documentation">
            <XIcon className="w-6 h-6"/>
          </button>
        </div>
      </header>
      
      <div className="flex flex-grow overflow-hidden">
        <aside className={`flex-shrink-0 bg-slate-50 border-r border-gray-200 flex flex-col justify-between transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
            <nav className="p-4 space-y-2">
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                    <button 
                        key={id} 
                        onClick={() => setActiveSection(id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-semibold transition-colors ${
                            activeSection === id 
                                ? 'bg-indigo-100 text-indigo-700' 
                                : 'text-slate-600 hover:bg-slate-200'
                        } ${!isSidebarOpen && 'justify-center'}`}
                        title={label}
                    >
                        <Icon className="w-5 h-5 flex-shrink-0"/>
                        {isSidebarOpen && <span>{label}</span>}
                    </button>
                ))}
            </nav>
            <div className={`p-4 border-t border-gray-200 ${!isSidebarOpen && 'text-center'}`}>
                 <p className={`text-xs text-slate-500 ${!isSidebarOpen && 'hidden'}`}>Developed by Wolfsi Dev Studios</p>
            </div>
        </aside>

        <main className="flex-grow overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-12">
                <ActiveComponent />
            </div>
        </main>
      </div>
    </div>
  );
};

export default DocsView;
