import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native"

export default function HomeScreen() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [error, setError] = useState("")

  const searchBooks = async () => {
    if (!query.trim()) {
      setError("Digite algo para buscar")
      return
    }
    setError("")
    setLoading(true)
    setSelectedBook(null)
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`)
      const data = await res.json()
      setBooks(data.items || [])
    } catch (err) {
      setError("Erro na busca. Tente novamente.")
    }
    setLoading(false)
  }

  const renderBook = ({ item }) => {
    const volumeInfo = item.volumeInfo
    return (
      <TouchableOpacity style={styles.bookCard} onPress={() => setSelectedBook(item)}>
        <Image
          source={{ uri: volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150x200?text=Sem+Imagem" }}
          style={styles.thumbnail}
        />
        <View style={styles.bookInfo}>
          <Text style={styles.title} numberOfLines={2}>{volumeInfo.title || "Sem título"}</Text>
          <Text style={styles.authors}>{volumeInfo.authors?.join(", ") || "Autor desconhecido"}</Text>
          <Text style={styles.published}>Publicado: {volumeInfo.publishedDate || "Data desconhecida"}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 Palavraria</Text>
      <Text style={styles.subHeader}>Encontre livros usando a API do Google Books</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o título, autor ou assunto do livro"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchBooks}
        />
        <TouchableOpacity style={styles.button} onPress={searchBooks}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#22333b" style={{ marginTop: 20 }} />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !selectedBook && books.length > 0 && (
        <FlatList
          data={books}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderBook}
          contentContainerStyle={styles.results}
        />
      )}

      {!loading && !selectedBook && books.length === 0 && !error && (
        <Text style={styles.noResults}>🔍 Faça sua busca na API integrada à Palavraria</Text>
      )}

      {selectedBook && (
        <ScrollView style={styles.details}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedBook(null)}>
            <Text style={{ color: "#fff" }}>← Voltar</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: selectedBook.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150x200?text=Sem+Imagem" }}
            style={styles.detailsThumb}
          />
          <Text style={styles.detailsTitle}>{selectedBook.volumeInfo.title}</Text>
          <Text style={styles.detailsAuthors}>Por: {selectedBook.volumeInfo.authors?.join(", ") || "Autor desconhecido"}</Text>
          <Text style={styles.meta}>Publicado: {selectedBook.volumeInfo.publishedDate || "Data desconhecida"}</Text>
          <Text style={styles.meta}>Editora: {selectedBook.volumeInfo.publisher || "Desconhecida"}</Text>
          <Text style={styles.meta}>Páginas: {selectedBook.volumeInfo.pageCount || "?"}</Text>
          <Text style={styles.meta}>Categorias: {selectedBook.volumeInfo.categories?.join(", ") || "Não informado"}</Text>
          <Text style={styles.desc}>{selectedBook.volumeInfo.description || "Descrição não disponível."}</Text>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf9f6", padding: 16 },
  header: { fontSize: 28, fontWeight: "700", color: "#22333b", textAlign: "center", marginBottom: 4 },
  subHeader: { textAlign: "center", fontSize: 14, color: "#566270", marginBottom: 16 },
  searchContainer: { flexDirection: "row", marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: "#e0d9cf", borderRadius: 8, padding: 12, backgroundColor: "#fff" },
  button: { backgroundColor: "#22333b", paddingHorizontal: 20, justifyContent: "center", borderRadius: 8, marginLeft: 8 },
  results: { gap: 12 },
  bookCard: { backgroundColor: "#fff", borderRadius: 8, flexDirection: "row", padding: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4 },
  thumbnail: { width: 80, height: 110, borderRadius: 6, marginRight: 10 },
  bookInfo: { flex: 1, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "600", color: "#22333b" },
  authors: { fontSize: 14, color: "#566270", fontStyle: "italic" },
  published: { fontSize: 12, color: "#566270" },
  error: { color: "red", textAlign: "center", marginVertical: 10 },
  noResults: { textAlign: "center", color: "#566270", marginTop: 40 },
  details: { marginTop: 10, backgroundColor: "#fff", padding: 16, borderRadius: 8 },
  backBtn: { backgroundColor: "#22333b", padding: 10, borderRadius: 6, marginBottom: 12, alignSelf: "flex-start" },
  detailsThumb: { width: 160, height: 220, alignSelf: "center", borderRadius: 6, marginBottom: 16 },
  detailsTitle: { fontSize: 20, fontWeight: "700", color: "#22333b", marginBottom: 6 },
  detailsAuthors: { fontSize: 16, color: "#c6ad8f", marginBottom: 10 },
  meta: { fontSize: 14, color: "#566270", marginBottom: 4 },
  desc: { fontSize: 14, color: "#22333b", marginTop: 12, lineHeight: 20 }
})
