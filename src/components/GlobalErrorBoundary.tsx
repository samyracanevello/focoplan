import { FallbackProps } from 'react-error-boundary';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';
import Button from './ui/Button';

export const GlobalErrorBoundary = ({ error, resetErrorBoundary }: FallbackProps) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return (
        <div className="min-h-screen bg-pastel-cream flex items-center justify-center p-6 text-slate-800">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 rounded-3xl bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <AlertOctagon size={40} />
                </div>
                
                <h1 className="text-3xl font-black tracking-tight mb-3">Ops! Algo quebrou.</h1>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
                    Desculpe, encontramos um erro inesperado no sistema. 
                    Nossa equipe já foi (teoricamente) notificada.
                </p>

                <div className="bg-white/60 p-4 rounded-xl text-left border border-white/80 shadow-sm mb-8 overflow-auto max-h-40">
                    <p className="text-xs font-mono text-red-500 whitespace-pre-wrap">
                        {errorMessage}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={resetErrorBoundary} className="flex-1">
                        <RefreshCw size={16} className="mr-2" /> Tentar Novamente
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
                        <Home size={16} className="mr-2" /> Ir para Home
                    </Button>
                </div>
            </div>
        </div>
    );
};
