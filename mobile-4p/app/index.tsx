import React, { useEffect, useState } from "react";
import { View, Text, SectionList, TextInput, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";

export default function Index() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();

        const continents = data.reduce((sections, country) => {
          const continent = country.continents[0];
          const countryData = {
            name: country.name.common,
            officialName: country.name.official,
            capital: country.capital ? country.capital[0] : "Desconhecida",
            flag: country.flags.png,
            continent: continent,
            currencies: country.currencies || {},
            latlng: country.latlng || [],
            languages: country.languages || {},
            area: country.area,
            population: country.population,
          };

          const section = sections.find(s => s.title === continent);
          if (section) {
            section.data.push(countryData);
          } else {
            sections.push({ title: continent, data: [countryData] });
          }

          return sections;
        }, []);

        setCountries(continents);
        setFilteredCountries(continents);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text) {
      setFilteredCountries(countries);
      return;
    }

    const filtered = countries.map(section => ({
      ...section,
      data: section.data.filter(country =>
        country.name.toLowerCase().includes(text.toLowerCase())
      ),
    })).filter(section => section.data.length > 0);

    setFilteredCountries(filtered);
  };

  const handleCountryPress = (country) => {
    setSelectedCountry(country);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
        <Text style={styles.loadingText}>Carregando países...</Text>
      </View>
    );
  }

  if (selectedCountry) {
    return (
      <View style={styles.countryDetailContainer}>
        <Text style={styles.countryTitle}>{selectedCountry.name}</Text>
        <Image source={{ uri: selectedCountry.flag }} style={styles.countryFlag} />
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Nome Oficial: {selectedCountry.officialName}</Text>
          <Text style={styles.infoText}>Capital: {selectedCountry.capital}</Text>
          <Text style={styles.infoText}>Continente: {selectedCountry.continent}</Text>
          <Text style={styles.infoText}>Moedas: {Object.keys(selectedCountry.currencies).join(', ')}</Text>
          <Text style={styles.infoText}>Lat/Long: {selectedCountry.latlng.join(', ')}</Text>
          <Text style={styles.infoText}>Línguas: {Object.values(selectedCountry.languages).join(', ')}</Text>
          <Text style={styles.infoText}>Área: {selectedCountry.area} km²</Text>
          <Text style={styles.infoText}>População: {selectedCountry.population}</Text>
        </View>
        <TouchableOpacity onPress={() => setSelectedCountry(null)}>
          <Text style={styles.backButton}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar país..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <SectionList
        sections={filteredCountries}
        keyExtractor={(item, index) => item.name + index}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.countryContainer}
            onPress={() => handleCountryPress(item)}
          >
            <Image source={{ uri: item.flag }} style={styles.flag} />
            <View style={styles.countryInfo}>
              <Text style={styles.countryName}>{item.name}</Text>
              <Text style={styles.countryCapital}>Capital: {item.capital}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#eef5f9",
  },
  searchBar: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: "#c4dff6",
    padding: 6,
    color: "#333",
    borderRadius: 5,
    marginBottom: 6,
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  flag: {
    width: 60,
    height: 40,
    marginRight: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  countryCapital: {
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
  countryDetailContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#eef5f9",
    alignItems: "center",
  },
  countryTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#ff6347",
  },
  countryFlag: {
    width: 180,
    height: 120,
    marginBottom: 20,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  infoBox: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  backButton: {
    fontSize: 18,
    color: "#ff6347",
    marginTop: 20,
  },
});
