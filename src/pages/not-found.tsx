import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background">
            <div className="text-center space-y-6 px-4">
                <div className="space-y-2">
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-pulse">
                        404
                    </h1>
                    <p className="text-2xl font-semibold text-foreground">
                        Page Not Found
                    </p>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>
                <a 
                    href="/" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Return to Home
                </a>
            </div>
        </div>
    );
};

export default NotFound;
