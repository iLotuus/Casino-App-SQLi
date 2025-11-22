import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet as WalletIcon } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const Wallet = () => {
  const { user, refreshUser } = useAuth();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  // Use user.balance if available, otherwise 0
  const balance = user?.balance || 0;

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/deposit', { amount: depositAmount });
      await refreshUser(); // Update global user state (including balance)
      // Mostrar el mensaje del backend (útil para exfiltración SQL)
      toast.success(response.data.message || 'Depósito procesado exitosamente');
      setDepositAmount("");
      // Add to local transactions list for demo purposes, or fetch from API if endpoint existed
      setTransactions(prev => [{
        id: Date.now(),
        type: "deposit",
        amount: parseFloat(depositAmount) || 0,
        date: new Date().toISOString().split('T')[0],
        description: "Depósito"
      }, ...prev]);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al depositar");
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/withdraw', { amount: withdrawAmount });
      await refreshUser(); // Update global user state
      // Mostrar el mensaje del backend (útil para exfiltración SQL)
      toast.success(response.data.message || 'Retiro solicitado exitosamente');
      setWithdrawAmount("");
      setTransactions(prev => [{
        id: Date.now(),
        type: "withdraw",
        amount: parseFloat(withdrawAmount) || 0,
        date: new Date().toISOString().split('T')[0],
        description: "Retiro"
      }, ...prev]);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al retirar");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Mi <span className="text-casino-gold">Billetera</span>
          </h1>
          <p className="text-muted-foreground">Administra tus fondos y transacciones</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-casino-red border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/80 mb-2">Saldo Disponible</p>
                <p className="text-5xl font-bold text-foreground">${balance.toFixed(2)}</p>
              </div>
              <div className="bg-casino-gold/20 p-4 rounded-full">
                <WalletIcon className="h-12 w-12 text-casino-gold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Deposit/Withdraw */}
          <Card>
            <CardHeader>
              <CardTitle>Transacciones</CardTitle>
              <CardDescription>Deposita o retira fondos de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="deposit">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="deposit">Depositar</TabsTrigger>
                  <TabsTrigger value="withdraw">Retirar</TabsTrigger>
                </TabsList>

                <TabsContent value="deposit">
                  <form onSubmit={handleDeposit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="deposit-amount">Monto a Depositar</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="deposit-amount"
                          type="text"
                          placeholder="100.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setDepositAmount("50")} className="flex-1">$50</Button>
                      <Button type="button" variant="outline" onClick={() => setDepositAmount("100")} className="flex-1">$100</Button>
                      <Button type="button" variant="outline" onClick={() => setDepositAmount("500")} className="flex-1">$500</Button>
                    </div>
                    <Button type="submit" className="w-full bg-casino-gold text-casino-dark hover:bg-casino-gold/90">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Depositar Ahora
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="withdraw">
                  <form onSubmit={handleWithdraw} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="withdraw-amount">Monto a Retirar</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="withdraw-amount"
                          type="text"
                          placeholder="100.00"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Disponible para retiro: ${balance.toFixed(2)}
                      </p>
                    </div>
                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
                      Solicitar Retiro
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Transacciones</CardTitle>
              <CardDescription>Tus últimos movimientos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground">No hay transacciones recientes</p>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${transaction.type === 'deposit' ? 'bg-secondary/20' :
                          transaction.type === 'win' ? 'bg-casino-gold/20' :
                            'bg-primary/20'
                          }`}>
                          {transaction.type === 'deposit' && <TrendingDown className="h-4 w-4 text-secondary" />}
                          {transaction.type === 'win' && <DollarSign className="h-4 w-4 text-casino-gold" />}
                          {transaction.type === 'withdraw' && <TrendingUp className="h-4 w-4 text-primary" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <p className={`font-bold ${transaction.type === 'withdraw' ? 'text-primary' : 'text-casino-gold'
                        }`}>
                        {transaction.type === 'withdraw' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
