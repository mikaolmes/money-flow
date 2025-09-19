import React, { useState } from "react";
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

export default function MoneyFlowApp() {
  const [currentScreen, setCurrentScreen] = useState("setup");
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [bankBalance, setBankBalance] = useState("");

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
    },
  };

  const t =
    translations[(selectedLanguage?.code as keyof typeof translations) || "de"];
  const currencySymbol =
    currencies.find((c) => c.code === selectedCurrency?.code)?.symbol || "€";

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
    alert(`Setup abgeschlossen! Guthaben: ${currencySymbol} ${bankBalance}`);
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
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
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
});
