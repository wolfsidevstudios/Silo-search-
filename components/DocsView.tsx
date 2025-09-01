
import React from 'react';
import { XIcon, SparklesIcon, LightningIcon, DiamondIcon, BrainIcon, WandIcon, BookOpenIcon, ChatBubbleIcon } from './icons';

const DocsView: React.FC<{ onClose: () => void }> = ({ onClose }) => {

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
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col animate-in fade-in duration-300">
      <header className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Documentation</h1>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors" title="Close documentation">
            <XIcon className="w-6 h-6"/>
          </button>
        </div>
      </header>
      <div className="flex-grow overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-12 text-gray-700">
            <div className="mb-16">
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
            
            <div>
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
                <ReleaseNote version="v1.7" title="Agent Deep Research">
                    <p>Added a specialized agent mode for in-depth analysis with a unique futuristic animation and real-time source tracking. The home page was also reverted to a clean white theme.</p>
                </ReleaseNote>
                <ReleaseNote version="v1.6" title="Agent Control">
                    <p>Introduced Agent Fast (Gemini 2.5 Flash) and Agent Pro (Gemini 2.5 Pro) for user-selectable performance.</p>
                </ReleaseNote>
                <ReleaseNote version="v1.5" title="Silo Gen AI">
                    <p>Integrated AI image generation into the standard web search flow, providing three unique images with every result.</p>
                </ReleaseNote>
                <ReleaseNote version="v1.4" title="Image Search Flow">
                    <p>Created a dedicated animation and results view for image analysis, featuring keyword "thinking" bubbles.</p>
                </ReleaseNote>
                <ReleaseNote version="v1.3" title="Multi-modal Search">
                    <p>Enabled image uploads, allowing users to perform visual searches by providing an image with their text query.</p>
                </ReleaseNote>
                <ReleaseNote version="v1.2" title="Animated Browsing">
                    <p>Added a simulated browser animation to show the AI agent actively "browsing" sources before providing an answer.</p>
                </ReleaseNote>
                <ReleaseNote version="v1.1" title="UI Refresh">
                    <p>Introduced a vibrant, dark-themed home page and a modern multi-line input box for a more engaging user experience.</p>
                </ReleaseNote>
                <ReleaseNote version="v1.0" title="Initial Release">
                    <p>The first version of the agent-powered AI search browser, providing direct answers with sourced links.</p>
                </ReleaseNote>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DocsView;
