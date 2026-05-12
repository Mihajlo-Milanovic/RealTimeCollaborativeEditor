"use client";

import { useHocuspocusAwareness } from "@hocuspocus/provider-react";
import { useEffect, useState } from "react";
import {CollabUser} from "../../../models/interfaces/CollabUser"

export const OnlineUsers = () => {
    const users = useHocuspocusAwareness() as CollabUser[];
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3">
            <div className="flex items-center space-x-3">
				<span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
					{users.length} Users online
				</span>
                {mounted && (
                    <>
                        <div className="flex -space-x-2">
                            {users.sort((u1, u2) => u1.username.localeCompare(u2.username)).map((user) => (
                                <div
                                    key={user.clientId}
                                    className={`w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center`}
                                    style={{ backgroundColor: user.color }}
                                    title={`${user.username}`}
                                >
									<span className="text-white text-xs font-bold">
										{`${user.username[0].toUpperCase()}`}
									</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
