import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import { Mountain, Upload, List } from "lucide-react";

export function Navbar() {
    const location = useLocation();

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="w-full flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center space-x-2 shrink-0 min-w-0">
                    <Mountain className="h-6 w-6 text-primary" />
                    <span className="font-bold truncate">Ranger Copilot</span>
                </Link>
                <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0">
                    <Link to="/upload">
                        <Button
                            variant={location.pathname === "/upload" ? "default" : "ghost"}
                            size="sm"
                            className="gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Upload
                        </Button>
                    </Link>
                    {location.pathname.includes("/results/") && (
                        <Button variant="outline" size="sm" className="gap-2" disabled>
                            <List className="h-4 w-4" />
                            Current results
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
