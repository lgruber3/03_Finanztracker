import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
//@ts-ignore
const CurrencyConverter = ({ navigation }) => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState('104.08');
  const [exchangeRate, setExchangeRate] = useState(1.0408);
  const [rateChange, setRateChange] = useState({ percent: 0.79, value: 0.0081 });
  const [showFromCurrencyModal, setShowFromCurrencyModal] = useState(false);
  const [showToCurrencyModal, setShowToCurrencyModal] = useState(false);

  // Währungsdaten
  const currencies = ['EUR', 'USD', 'GBP', 'JPY', 'CHF'];
  const exchangeRates = {
    EUR: { USD: 1.0408, GBP: 0.85, JPY: 140.5, CHF: 0.98 },
    USD: { EUR: 0.96, GBP: 0.82, JPY: 135.0, CHF: 0.94 },
    GBP: { EUR: 1.18, USD: 1.22, JPY: 165.3, CHF: 1.15 },
    JPY: { EUR: 0.0071, USD: 0.0074, GBP: 0.0060, CHF: 0.0070 },
    CHF: { EUR: 1.02, USD: 1.06, GBP: 0.87, JPY: 142.8 }
  };

  // Währungsumrechnung
  const convertCurrency = () => {
    if (!amount) {
      setConvertedAmount('0');
      return;
    }

    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      setExchangeRate(1);
      setRateChange({ percent: 0, value: 0 });
      return;
    }
    //@ts-ignore
    const rate = exchangeRates[fromCurrency][toCurrency];
    const result = (parseFloat(amount) * rate).toFixed(2);
    
    setExchangeRate(rate);
    setConvertedAmount(result);
    
    // Simulierte Änderungsdaten
    setRateChange({
      percent: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      value: parseFloat((Math.random() * 0.02 - 0.01).toFixed(5))
    });
  };

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);
  //@ts-ignore
  const selectCurrency = (currency, isFromCurrency) => {
    if (isFromCurrency) {
      setFromCurrency(currency);
      setShowFromCurrencyModal(false);
    } else {
      setToCurrency(currency);
      setShowToCurrencyModal(false);
    }
  };
  //@ts-ignore
  const CurrencyModal = ({ visible, onClose, onSelect, isFromCurrency }) => (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Währung wählen</Text>
          {currencies.map((currency) => (
            <TouchableOpacity
              key={currency}
              style={styles.currencyItem}
              onPress={() => onSelect(currency, isFromCurrency)}
            >
              <Text style={styles.currencyItemText}>{currency}</Text>
              {((isFromCurrency && currency === fromCurrency) || 
               (!isFromCurrency && currency === toCurrency)) && (
                <Ionicons name="checkmark" size={20} color="#00FF7F" />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Grün-Schwarzer Hintergrund */}
      <View style={{ flex: 4, backgroundColor: "#00FF7F" }} />
      <View style={{ flex: 6, backgroundColor: "#222222" }} />
      
      {/* Hauptcontainer */}
      <View style={styles.whiteContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          {/*
          <Ionicons name="arrow-back" size={24} color="#333" />
            */}
        </TouchableOpacity>

        {/* Währungsmodals */}
        <CurrencyModal
          visible={showFromCurrencyModal}
          onClose={() => setShowFromCurrencyModal(false)}
          //@ts-ignore
          onSelect={(currency) => selectCurrency(currency, true)}
          isFromCurrency={true}
        />
        <CurrencyModal
          visible={showToCurrencyModal}
          onClose={() => setShowToCurrencyModal(false)}
          //@ts-ignore
          onSelect={(currency) => selectCurrency(currency, false)}
          isFromCurrency={false}
        />
        
        {/* Eingabebereich */}
        <View style={styles.currencySection}>
          <View style={styles.currencySelector}>
            <TouchableOpacity 
              style={styles.currencyButton}
              onPress={() => setShowFromCurrencyModal(true)}
            >
              <Text style={styles.currencyLabel}>{fromCurrency} ▼</Text>
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Eingabe</Text>
          </View>
          
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
          />
          
          {/* Zahlen-Buttons - jetzt mit begrenzter Breite */}
          <View style={styles.numberPad}>
            <View style={styles.numberRow}>
              {[10, 50, 100].map((num) => (
                <TouchableOpacity 
                  key={num} 
                  style={styles.numberButton}
                  onPress={() => setAmount(num.toString())}
                >
                  <Text style={styles.numberText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.numberRow}>
              {[200, 500, 1000].map((num) => (
                <TouchableOpacity 
                  key={num} 
                  style={styles.numberButton}
                  onPress={() => setAmount(num.toString())}
                >
                  <Text style={styles.numberText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        {/* Wechselkurs Info */}
        <View style={styles.conversionInfo}>
          <Text style={styles.conversionText}>{fromCurrency} in {toCurrency}</Text>
          <Text style={styles.rateText}>
            {exchangeRate.toFixed(4)}  
            <Text style={rateChange.percent >= 0 ? styles.rateUp : styles.rateDown}>
              {rateChange.percent >= 0 ? ' +' : ' '}{rateChange.percent}%  
              {rateChange.value >= 0 ? ' +' : ' '}{rateChange.value.toFixed(5)}
            </Text>
          </Text>
          <Text style={styles.additionalInfo}>3. Net_0.93581/TO - Hiringabstrollers</Text>
        </View>
        
        {/* Ausgabebereich */}
        <View style={styles.currencySection}>
          <View style={styles.currencySelector}>
            <TouchableOpacity 
              style={styles.currencyButton}
              onPress={() => setShowToCurrencyModal(true)}
            >
              <Text style={styles.currencyLabel}>{toCurrency} ▼</Text>
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Ausgabe</Text>
          </View>
          <Text style={styles.output}>{convertedAmount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  whiteContainer: {
    position: 'absolute',
    top: '10%',
    left: 20,
    right: 20,
    bottom: '10%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 1,
  },
  currencySection: {
    marginBottom: 20,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  currencyButton: {
    marginRight: 10,
  },
  currencyLabel: {
    fontSize: 16,
    color: '#00FF7F',
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    fontSize: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    marginBottom: 20,
  },
  output: {
    fontSize: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  numberPad: {
    marginTop: 10,
    width: '100%', // Stellt sicher, dass der NumberPad die volle Breite nutzt
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  numberButton: {
    width: (Dimensions.get('window').width - 90) / 3, // Berechnet die Breite basierend auf Bildschirmbreite minus Padding
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    alignItems: 'center',
  },
  numberText: {
    fontSize: 18,
  },
  conversionInfo: {
    marginBottom: 20,
  },
  conversionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rateText: {
    fontSize: 14,
  },
  rateUp: {
    color: 'green',
  },
  rateDown: {
    color: 'red',
  },
  additionalInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currencyItemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#00FF7F',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CurrencyConverter;