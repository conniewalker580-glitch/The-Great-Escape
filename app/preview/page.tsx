"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PreviewPage() {
    const [status, setStatus] = useState("Idle");
    const [userData, setUserData] = useState<unknown>(null);
    const [aiResult, setAiResult] = useState("");

    const [, startTransition] = useTransition();

    const fetchUser = useCallback(async () => {
        const res = await fetch("/api/user-progress");
        const data = await res.json();
        startTransition(() => {
            setUserData(data);
        });
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const testGenerate = async () => {
        setStatus("Generating...");
        const res = await fetch("/api/generate-room", {
            method: "POST",
            body: JSON.stringify({ theme: "Debug Room", difficulty: "Easy" })
        });
        const data = await res.json();
        setAiResult(JSON.stringify(data, null, 2));
        setStatus(res.ok ? "Success" : "Failed");
        fetchUser();
    };

    return (
        <div className="p-8 bg-black/95 min-h-screen text-green-400 font-mono">
            <h1 className="text-2xl mb-8 border-b border-green-800 pb-2">ANTI-GRAVITY DEVELOPER CONSOLE</h1>

            <div className="grid grid-cols-2 gap-8">
                <Card className="bg-black border-green-800">
                    <CardHeader><CardTitle>User State (DB)</CardTitle></CardHeader>
                    <CardContent>
                        <pre className="text-xs">{JSON.stringify(userData, null, 2)}</pre>
                        <div className="mt-4 flex gap-2">
                            <Button onClick={fetchUser} size="sm" variant="outline">Refresh</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-black border-green-800">
                    <CardHeader><CardTitle>AI Test (HuggingFace/OpenAI)</CardTitle></CardHeader>
                    <CardContent>
                        <Button onClick={testGenerate} disabled={status === "Generating..."} className="w-full mb-4">
                            {status === "Generating..." ? "Processing..." : "Test Generate Room"}
                        </Button>
                        <div className="h-64 overflow-auto bg-green-900/10 p-2 rounded text-xs border border-green-900/50">
                            {aiResult || "// Waiting for input..."}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
