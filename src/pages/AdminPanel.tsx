import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [newBalance, setNewBalance] = useState("");
    const [terminalCommand, setTerminalCommand] = useState("");
    const [terminalOutput, setTerminalOutput] = useState("");

    useEffect(() => {
        if (!isLoading && (!user || !user.is_admin)) {
            toast.error("Acceso denegado");
            navigate("/");
            return;
        }

        if (user?.is_admin) {
            fetchUsers();
        }
    }, [user, isLoading, navigate]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            toast.error("Error al cargar usuarios");
        }
    };

    const handleUpdateBalance = async (userId: number) => {
        try {
            await api.post(`/admin/users/${userId}/balance`, { amount: newBalance });
            toast.success("Saldo actualizado");
            setEditingUserId(null);
            setNewBalance("");
            fetchUsers();
        } catch (error) {
            toast.error("Error al actualizar saldo");
        }
    };

    const handleTerminalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!terminalCommand.trim()) return;

        setTerminalOutput((prev) => prev + `\n$ ${terminalCommand}\n`);
        try {
            const response = await api.post('/admin/terminal', { command: terminalCommand });
            setTerminalOutput((prev) => prev + response.data.output);
        } catch (error: any) {
            setTerminalOutput((prev) => prev + `Error: ${error.response?.data?.detail || error.message}\n`);
            toast.error("Error al ejecutar comando");
        } finally {
            setTerminalCommand("");
        }
    };

    if (isLoading || !user?.is_admin) return null;

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">Panel de Administración</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Usuarios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Saldo</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell>{u.id}</TableCell>
                                        <TableCell>{u.username}</TableCell>
                                        <TableCell>${u.balance.toFixed(2)}</TableCell>
                                        <TableCell>{u.is_admin ? "Admin" : "Usuario"}</TableCell>
                                        <TableCell>
                                            {editingUserId === u.id ? (
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="number"
                                                        value={newBalance}
                                                        onChange={(e) => setNewBalance(e.target.value)}
                                                        placeholder="Nuevo saldo"
                                                        className="w-32"
                                                    />
                                                    <Button onClick={() => handleUpdateBalance(u.id)} size="sm">Guardar</Button>
                                                    <Button variant="ghost" onClick={() => setEditingUserId(null)} size="sm">Cancelar</Button>
                                                </div>
                                            ) : (
                                                <Button variant="outline" onClick={() => {
                                                    setEditingUserId(u.id);
                                                    setNewBalance(u.balance.toString());
                                                }} size="sm">
                                                    Editar Saldo
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="mt-8 bg-black border-green-500/50 font-mono">
                    <CardHeader>
                        <CardTitle className="text-green-500 flex items-center gap-2">
                            <span className="animate-pulse">_</span> Terminal del Sistema
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-black p-4 rounded-md border border-green-900 h-64 overflow-y-auto mb-4 text-green-400 text-sm whitespace-pre-wrap">
                            {terminalOutput || "Esperando comandos..."}
                        </div>
                        <form onSubmit={handleTerminalSubmit} className="flex gap-2">
                            <span className="text-green-500 py-2">$</span>
                            <Input
                                value={terminalCommand}
                                onChange={(e) => setTerminalCommand(e.target.value)}
                                className="bg-black border-green-900 text-green-500 focus-visible:ring-green-500"
                                placeholder="ls -la"
                            />
                            <Button type="submit" variant="outline" className="border-green-900 text-green-500 hover:bg-green-900/20 hover:text-green-400">
                                Ejecutar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminPanel;
