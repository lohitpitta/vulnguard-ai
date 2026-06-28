import { X, Shield, FileText, AlertTriangle, Zap, Search } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';

const AboutModal = () => {
  const { showAbout, setShowAbout } = useSettingsStore();

  if (!showAbout) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1B2436] border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#90CF2A]/20 to-[#90CF2A]/5 flex items-center justify-center">
              <Shield className="text-[#90CF2A]" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">About VulnGuard AI</h2>
              <p className="text-sm text-muted-foreground">AI-Powered CVE Intelligence Platform</p>
            </div>
          </div>
          <button
            onClick={() => setShowAbout(false)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border rounded-2xl hover:shadow-lg transition-all duration-200 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#90CF2A]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="text-[#90CF2A]" size={20} />
                </div>
                <h3 className="font-semibold">Analyze CVEs</h3>
              </div>
              <p className="text-sm text-muted-foreground">Get detailed vulnerability analysis and threat intelligence</p>
            </div>
            
            <div className="p-5 bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border rounded-2xl hover:shadow-lg transition-all duration-200 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#90CF2A]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="text-[#90CF2A]" size={20} />
                </div>
                <h3 className="font-semibold">Generate Reports</h3>
              </div>
              <p className="text-sm text-muted-foreground">Create comprehensive security reports and documentation</p>
            </div>
            
            <div className="p-5 bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border rounded-2xl hover:shadow-lg transition-all duration-200 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#90CF2A]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertTriangle className="text-[#90CF2A]" size={20} />
                </div>
                <h3 className="font-semibold">Mitigation Guidance</h3>
              </div>
              <p className="text-sm text-muted-foreground">Receive actionable remediation steps and security best practices</p>
            </div>
            
            <div className="p-5 bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border rounded-2xl hover:shadow-lg transition-all duration-200 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#90CF2A]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="text-[#90CF2A]" size={20} />
                </div>
                <h3 className="font-semibold">Exploit Intelligence</h3>
              </div>
              <p className="text-sm text-muted-foreground">Understand attack vectors and potential exploit scenarios</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-secondary/30 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground text-center">
              VulnGuard AI leverages advanced AI models to provide comprehensive CVE analysis and security intelligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
