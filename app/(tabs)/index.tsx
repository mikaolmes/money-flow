import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Interfaces
interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date;
  recurrence?: 'none' | 'weekly' | 'monthly' | 'secondly';
}

export default function MoneyFlowApp() {
  const [currentScreen, setCurrentScreen] = useState("setup");
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [bankBalance, setBankBalance] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransactionAmount, setNewTransactionAmount] = useState("");
  const [newTransactionDescription, setNewTransactionDescription] = useState("");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [recurrence, setRecurrence] = useState<'none' | 'weekly' | 'monthly' | 'secondly'>('none');

  const languages: Language[] = [
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

  const currencies: Currency[] = [
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "CHF", name: "Schweizer Franken", symbol: "CHF" },
    { code: "GBP", name: "British Pound", symbol: "£" },
  ];

  const translations = {
    de: {
      appTitle: "Money-Flow",
      welcomeTitle: "Willkommen bei Money-Flow",
      welcomeSubtitle: "Behalten Sie Ihre Finanzen im Blick",
      selectLanguage: "Sprache auswählen",
      selectCurrency: "Währung auswählen",
      continue: "Weiter",
      back: "Zurück",
      bankBalanceTitle: "Aktuelles Bankguthaben",
      bankBalanceSubtitle: "Geben Sie Ihr aktuelles Guthaben ein",
      enterAmount: "Betrag eingeben...",
      setup: "Einrichtung",
      dashboard: "Übersicht",
      settings: "Einstellungen",
      currentBalance: "Aktueller Saldo",
      addTransaction: "Transaktion hinzufügen",
      income: "Einnahme",
      expense: "Ausgabe",
      description: "Beschreibung",
      add: "Hinzufügen",
      cancel: "Abbrechen",
      resetAccount: "Account zurücksetzen",
      resetConfirm: "Möchten Sie wirklich alle Daten löschen?",
      reset: "Zurücksetzen",
      transactions: "Transaktionen",
      noTransactions: "Keine Transaktionen vorhanden",
      today: "Heute",
    },
    en: {
      appTitle: "Money-Flow",
      welcomeTitle: "Welcome to Money-Flow",
      welcomeSubtitle: "Keep track of your finances",
      selectLanguage: "Select Language",
      selectCurrency: "Select Currency",
      continue: "Continue",
      back: "Back",
      bankBalanceTitle: "Current Bank Balance",
      bankBalanceSubtitle: "Enter your current balance",
      enterAmount: "Enter amount...",
      setup: "Setup",
      dashboard: "Dashboard",
      settings: "Settings",
      currentBalance: "Current Balance",
      addTransaction: "Add Transaction",
      income: "Income",
      expense: "Expense",
      description: "Description",
      add: "Add",
      cancel: "Cancel",
      resetAccount: "Reset Account",
      resetConfirm: "Do you really want to delete all data?",
      reset: "Reset",
      transactions: "Transactions",
      noTransactions: "No transactions available",
      today: "Today",
    },
    fr: {
      appTitle: "Money-Flow",
      welcomeTitle: "Bienvenue chez Money-Flow",
      welcomeSubtitle: "Gardez une trace de vos finances",
      selectLanguage: "Choisir la langue",
      selectCurrency: "Choisir la devise",
      continue: "Continuer",
      back: "Retour",
      bankBalanceTitle: "Solde bancaire actuel",
      bankBalanceSubtitle: "Entrez votre solde actuel",
      enterAmount: "Entrez le montant...",
      setup: "Configuration",
      dashboard: "Tableau de bord",
      settings: "Paramètres",
      currentBalance: "Solde actuel",
      addTransaction: "Ajouter une transaction",
      income: "Revenu",
      expense: "Dépense",
      description: "Description",
      add: "Ajouter",
      cancel: "Annuler",
      resetAccount: "Réinitialiser le compte",
      resetConfirm: "Voulez-vous vraiment supprimer toutes les données?",
      reset: "Réinitialiser",
      transactions: "Transactions",
      noTransactions: "Aucune transaction disponible",
      today: "Aujourd'hui",
    },
    es: {
      appTitle: "Money-Flow",
      welcomeTitle: "Bienvenido a Money-Flow",
      welcomeSubtitle: "Mantén un registro de tus finanzas",
      selectLanguage: "Seleccionar idioma",
      selectCurrency: "Seleccionar moneda",
      continue: "Continuar",
      back: "Atrás",
      bankBalanceTitle: "Saldo bancario actual",
      bankBalanceSubtitle: "Ingrese su saldo actual",
      enterAmount: "Ingrese la cantidad...",
      setup: "Configuración",
      dashboard: "Panel",
      settings: "Configuración",
      currentBalance: "Saldo actual",
      addTransaction: "Agregar transacción",
      income: "Ingreso",
      expense: "Gasto",
      description: "Descripción",
      add: "Agregar",
      cancel: "Cancelar",
      resetAccount: "Restablecer cuenta",
      resetConfirm: "¿Realmente quiere eliminar todos los datos?",
      reset: "Restablecer",
      transactions: "Transacciones",
      noTransactions: "No hay transacciones disponibles",
      today: "Hoy",
    },
  };

  const t =
    translations[(selectedLanguage?.code as keyof typeof translations) || "de"];
  const currencySymbol =
    currencies.find((c) => c.code === selectedCurrency?.code)?.symbol || "€";

  // Währungsumrechnung (vereinfachte Raten)
  const exchangeRates: { [key: string]: { [key: string]: number } } = {
    EUR: { USD: 1.1, CHF: 0.95, GBP: 0.85, EUR: 1 },
    USD: { EUR: 0.91, CHF: 0.86, GBP: 0.77, USD: 1 },
    CHF: { EUR: 1.05, USD: 1.16, GBP: 0.90, CHF: 1 },
    GBP: { EUR: 1.18, USD: 1.30, CHF: 1.11, GBP: 1 },
  };

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    return amount * (exchangeRates[fromCurrency]?.[toCurrency] || 1);
  };

  const calculateCurrentBalance = (): number => {
    const initialBalance = parseFloat(bankBalance) || 0;
    const transactionTotal = transactions.reduce((total, transaction) => {
      // If transaction is recurring, approximate occurrences per month
      let occurrences = 1;
      if (transaction.recurrence === 'weekly') occurrences = 4; // approx 4 weeks per month
      if (transaction.recurrence === 'monthly') occurrences = 1;
      const signed = transaction.type === 'income' ? transaction.amount * occurrences : -transaction.amount * occurrences;
      return total + signed;
    }, 0);
    return initialBalance + transactionTotal;
  };

  const handleContinueSetup = () => {
    if (!selectedLanguage || !selectedCurrency) {
      alert("Bitte wählen Sie Sprache und Währung aus.");
      return;
    }
    setCurrentScreen("balance");
  };

  const handleContinueBalance = () => {
    if (!bankBalance || isNaN(parseFloat(bankBalance))) {
      alert("Bitte geben Sie einen gültigen Betrag ein.");
      return;
    }
    setCurrentScreen("dashboard");
  };

  const addTransaction = () => {
    if (!newTransactionAmount || !newTransactionDescription || isNaN(parseFloat(newTransactionAmount))) {
      alert("Bitte füllen Sie alle Felder korrekt aus.");
      return;
    }

    // If editing, update existing transaction
    if (editingTransaction) {
      const updated: Transaction = {
        ...editingTransaction,
        type: transactionType,
        amount: parseFloat(newTransactionAmount),
        description: newTransactionDescription,
        // keep original date
        recurrence: recurrence,
      };
      setTransactions(transactions.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTransaction(null);
      setNewTransactionAmount("");
      setNewTransactionDescription("");
      setShowAddTransaction(false);
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: transactionType,
      amount: parseFloat(newTransactionAmount),
      description: newTransactionDescription,
      date: new Date(),
      recurrence: recurrence,
    };

    setTransactions([newTransaction, ...transactions]);
    setNewTransactionAmount("");
    setNewTransactionDescription("");
    setShowAddTransaction(false);
  };

  const onEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setTransactionType(tx.type);
    setNewTransactionAmount(tx.amount.toString());
    setNewTransactionDescription(tx.description);
    setRecurrence(tx.recurrence || 'none');
    setShowAddTransaction(true);
  };

  const deleteTransaction = (id: string) => {
    const ok = typeof window !== 'undefined' && window.confirm ? window.confirm(t.resetConfirm) : true;
    if (!ok) return;
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // Generate real transactions every second for any transaction marked 'secondly'.
  const secondlyIntervalRef = useRef<number | null>(null);
  useEffect(() => {
    // clear previous interval
    if (secondlyIntervalRef.current) {
      clearInterval(secondlyIntervalRef.current);
      secondlyIntervalRef.current = null;
    }

    if (currentScreen !== 'dashboard') return;

    const templates = transactions.filter((tx) => tx.recurrence === 'secondly');
    if (templates.length === 0) return;

    // set up interval
    const id = setInterval(() => {
      setTransactions((prev) => {
        const now = new Date();
        const newOnes = templates.map((tpl) => ({
          id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
          type: tpl.type,
          amount: tpl.amount,
          description: tpl.description + ' (auto)',
          date: now,
          recurrence: 'none' as const,
        }));
        // prepend new generated transactions
        const merged = [...newOnes, ...prev];
        // keep list capped to 500 items to avoid memory blowup during testing
        return merged.slice(0, 500);
      });
    }, 1000);

    secondlyIntervalRef.current = id as unknown as number;

    return () => {
      if (secondlyIntervalRef.current) {
        clearInterval(secondlyIntervalRef.current);
        secondlyIntervalRef.current = null;
      }
    };
  }, [transactions, currentScreen]);

  const resetAccount = () => {
    // Einfache Bestätigung mit alert - in einer echten App würde man ein Modal verwenden
    if (window.confirm && window.confirm(t.resetConfirm)) {
      setTransactions([]);
      setBankBalance("");
      setCurrentScreen("setup");
      setSelectedLanguage(null);
      setSelectedCurrency(null);
    } else {
      // Fallback für React Native
      setTransactions([]);
      setBankBalance("");
      setCurrentScreen("setup");
      setSelectedLanguage(null);
      setSelectedCurrency(null);
    }
  };

  const changeCurrency = (newCurrency: Currency) => {
    if (selectedCurrency && bankBalance) {
      const convertedBalance = convertCurrency(
        parseFloat(bankBalance),
        selectedCurrency.code,
        newCurrency.code
      );
      setBankBalance(convertedBalance.toFixed(2));
    }
    
    // Konvertiere alle Transaktionen
    if (selectedCurrency) {
      const convertedTransactions = transactions.map(transaction => ({
        ...transaction,
        amount: convertCurrency(transaction.amount, selectedCurrency.code, newCurrency.code)
      }));
      setTransactions(convertedTransactions);
    }
    
    setSelectedCurrency(newCurrency);
  };

  const formatBalance = (value: string): string => {
    return value.replace(/[^0-9.,]/g, "").replace(",", ".");
  };

  if (currentScreen === "setup") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.appTitle}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{t.welcomeTitle}</Text>
          <Text style={styles.subtitle}>{t.welcomeSubtitle}</Text>

          <Text style={styles.sectionTitle}>{t.selectLanguage}</Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.card,
                selectedLanguage?.code === lang.code && styles.cardSelected,
              ]}
              onPress={() => setSelectedLanguage(lang)}
            >
              <Text style={styles.cardText}>
                {lang.flag} {lang.name}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionTitle}>{t.selectCurrency}</Text>
          {currencies.map((currency) => (
            <TouchableOpacity
              key={currency.code}
              style={[
                styles.card,
                selectedCurrency?.code === currency.code && styles.cardSelected,
              ]}
              onPress={() => setSelectedCurrency(currency)}
            >
              <Text style={styles.cardText}>
                {currency.symbol} {currency.name} ({currency.code})
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[
              styles.button,
              !(selectedLanguage && selectedCurrency) && styles.buttonDisabled,
            ]}
            onPress={handleContinueSetup}
            disabled={!selectedLanguage || !selectedCurrency}
          >
            <Text style={styles.buttonText}>{t.continue}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (currentScreen === "balance") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentScreen("setup")}>
            <Text style={styles.backText}>← {t.back}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.setup}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{t.bankBalanceTitle}</Text>
          <Text style={styles.subtitle}>{t.bankBalanceSubtitle}</Text>

          <View style={styles.balanceRow}>
            <Text style={styles.balanceSymbol}>{currencySymbol}</Text>
            <TextInput
              style={styles.balanceInput}
              placeholder={t.enterAmount}
              value={bankBalance}
              onChangeText={(v) => setBankBalance(formatBalance(v))}
              keyboardType="decimal-pad"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (!bankBalance || isNaN(parseFloat(bankBalance))) &&
                styles.buttonDisabled,
            ]}
            onPress={handleContinueBalance}
            disabled={!bankBalance || isNaN(parseFloat(bankBalance))}
          >
            <Text style={styles.buttonText}>{t.continue}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (currentScreen === "dashboard") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.dashboard}</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setCurrentScreen("settings")}
          >
            <Text style={styles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Aktueller Saldo */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>{t.currentBalance}</Text>
            <Text style={styles.balanceAmount}>
              {currencySymbol} {calculateCurrentBalance().toFixed(2)}
            </Text>
          </View>

          {/* Transaktion hinzufügen Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddTransaction(true)}
          >
            <Text style={styles.addButtonText}>+ {t.addTransaction}</Text>
          </TouchableOpacity>

          {/* Transaktionsliste */}
          <Text style={styles.sectionTitle}>{t.transactions}</Text>
          {transactions.length === 0 ? (
            <Text style={styles.noTransactions}>{t.noTransactions}</Text>
          ) : (
            transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                    <View style={styles.transactionRight}>
                      <Text
                        style={[
                          styles.transactionAmount,
                          transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount,
                        ]}
                      >
                        {transaction.type === 'income' ? '+' : '-'}{currencySymbol} {transaction.amount.toFixed(2)}
                      </Text>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity onPress={() => onEditTransaction(transaction)} style={styles.actionButton}>
                          <Text style={styles.actionButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteTransaction(transaction.id)} style={[styles.actionButton, styles.deleteAction] }>
                          <Text style={[styles.actionButtonText, styles.deleteActionText]}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                </View>
                <Text style={styles.transactionDate}>
                  {transaction.date.toLocaleDateString()}
                </Text>
                  {transaction.recurrence && transaction.recurrence !== 'none' && (
                    <View style={styles.recurrenceBadge}>
                      <Text style={styles.recurrenceBadgeText}>
                        {transaction.recurrence === 'weekly' ? 'Weekly' : 'Monthly'}
                      </Text>
                    </View>
                  )}
              </View>
            ))
          )}
        </View>

        {/* Add Transaction Modal */}
        {showAddTransaction && (
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editingTransaction ? 'Edit Transaction' : t.addTransaction}</Text>
              
              {/* Typ auswählen */}
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'income' && styles.typeButtonSelected,
                  ]}
                  onPress={() => setTransactionType('income')}
                >
                  <Text style={styles.typeButtonText}>{t.income}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'expense' && styles.typeButtonSelected,
                  ]}
                  onPress={() => setTransactionType('expense')}
                >
                  <Text style={styles.typeButtonText}>{t.expense}</Text>
                </TouchableOpacity>
              </View>

              {/* Recurrence selector */}
              <View style={{ flexDirection: 'row', marginBottom: 12, justifyContent: 'center' }}>
                <TouchableOpacity
                  style={[styles.typeButton, recurrence === 'none' && styles.typeButtonSelected]}
                  onPress={() => setRecurrence('none')}
                >
                  <Text style={styles.typeButtonText}>None</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, recurrence === 'weekly' && styles.typeButtonSelected]}
                  onPress={() => setRecurrence('weekly')}
                >
                  <Text style={styles.typeButtonText}>Weekly</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, recurrence === 'monthly' && styles.typeButtonSelected]}
                  onPress={() => setRecurrence('monthly')}
                >
                  <Text style={styles.typeButtonText}>Monthly</Text>
                </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.typeButton, recurrence === 'secondly' && styles.typeButtonSelected]}
                    onPress={() => setRecurrence('secondly')}
                  >
                    <Text style={styles.typeButtonText}>Every sec</Text>
                  </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder={t.enterAmount}
                value={newTransactionAmount}
                onChangeText={setNewTransactionAmount}
                keyboardType="decimal-pad"
              />

              <TextInput
                style={styles.input}
                placeholder={t.description}
                value={newTransactionDescription}
                onChangeText={setNewTransactionDescription}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => { setShowAddTransaction(false); setEditingTransaction(null); setNewTransactionAmount(''); setNewTransactionDescription(''); }}
                >
                  <Text style={styles.modalButtonText}>{t.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={addTransaction}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                    {editingTransaction ? 'Save' : t.add}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }

  if (currentScreen === "settings") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentScreen("dashboard")}>
            <Text style={styles.backText}>← {t.back}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.settings}</Text>
        </View>

        <View style={styles.content}>
          {/* Sprache ändern */}
          <Text style={styles.sectionTitle}>{t.selectLanguage}</Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.card,
                selectedLanguage?.code === lang.code && styles.cardSelected,
              ]}
              onPress={() => setSelectedLanguage(lang)}
            >
              <Text style={styles.cardText}>
                {lang.flag} {lang.name}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Währung ändern */}
          <Text style={styles.sectionTitle}>{t.selectCurrency}</Text>
          {currencies.map((currency) => (
            <TouchableOpacity
              key={currency.code}
              style={[
                styles.card,
                selectedCurrency?.code === currency.code && styles.cardSelected,
              ]}
              onPress={() => changeCurrency(currency)}
            >
              <Text style={styles.cardText}>
                {currency.symbol} {currency.name} ({currency.code})
              </Text>
            </TouchableOpacity>
          ))}

          {/* Account zurücksetzen */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetAccount}
          >
            <Text style={styles.resetButtonText}>{t.resetAccount}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#2563eb",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  settingsButton: {
    position: "absolute",
    right: 20,
    top: 60,
  },
  settingsButtonText: {
    color: "white",
    fontSize: 24,
  },
  backText: {
    color: "white",
    fontSize: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#dbeafe",
  },
  cardText: {
    fontSize: 16,
    color: "#374151",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  balanceSymbol: {
    fontSize: 28,
    color: "#6b7280",
    marginRight: 10,
  },
  balanceInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 22,
    backgroundColor: "white",
    minWidth: 150,
    textAlign: "center",
  },
  // Dashboard Styles
  balanceCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
  },
  addButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  noTransactions: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
    marginTop: 20,
  },
  transactionCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  incomeAmount: {
    color: "#10b981",
  },
  expenseAmount: {
    color: "#ef4444",
  },
  transactionDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  transactionRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 6,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginLeft: 6,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#374151',
  },
  deleteAction: {
    borderColor: '#ef4444',
    backgroundColor: '#fff5f5',
  },
  deleteActionText: {
    color: '#ef4444',
  },
  recurrenceBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recurrenceBadgeText: {
    fontSize: 12,
    color: '#374151',
  },
  // Modal Styles
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#111827",
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginHorizontal: 4,
    alignItems: "center",
  },
  typeButtonSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  typeButtonText: {
    fontSize: 16,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "white",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  modalButtonPrimary: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#374151",
  },
  modalButtonTextPrimary: {
    color: "white",
  },
  // Settings Styles
  resetButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 30,
  },
  resetButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
