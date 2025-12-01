import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function Profile() {
  const router = useRouter()
  const [books, setBooks] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const response = await fetch("https://tcc-back-2025.vercel.app/livros")
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.log("Erro ao carregar dados:", error)
    }
  }

  const recentBooks = books.slice(0, 5)

  const renderRecentBooks =
    recentBooks.length === 0 ? (
      <Text style={styles.empty}>Nenhum livro adicionado recentemente.</Text>
    ) : (
      recentBooks.map((book, index) => (
        <View key={index} style={styles.recentBookItem}>
          <View style={styles.recentBookInfo}>
            <Text style={styles.recentBookTitle}>{book.titulo}</Text>
            <Text style={styles.recentBookAuthor}>{book.autor}</Text>
            <Text style={styles.recentBookDetails}>
              {book.editora ? `${book.editora} • ` : ""}
              {book.ano ? `${book.ano} • ` : ""}
              {book.paginas ? `${book.paginas} páginas` : ""}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(book.status) }
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(book.status)}</Text>
          </View>
        </View>
      ))
    )

  const booksRead = books.filter(b => b.status === "lido").length
  const booksInProgress = books.filter(b => b.status === "lendo" || b.status === "relendo").length

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Meu Perfil de Leitura</Text>
      <Text style={styles.subheader}>Acompanhe seu progresso de leitura e gerencie sua biblioteca pessoal</Text>

      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}></View>
          <View>
            <Text style={styles.username}>@usuario</Text>
            <Text style={styles.memberInfo}>Membro desde Março 2025</Text>
            <Text style={styles.stats}>{booksRead} livros lidos • {booksInProgress} em progresso</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adicionar Livros</Text>
        <Text style={styles.sectionDescription}>Busque livros na nossa base integrada com a API do Google Books</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/src/googlebook")}>
          <Text style={styles.primaryButtonText}>Buscar e Registrar Livro</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Livros Adicionados Recentemente</Text>
        {renderRecentBooks}
      </View>
    </ScrollView>
  )
}

function getStatusColor(status) {
  const colors = {
    "quero-ler": "#666",
    "lendo": "#2196F3",
    "lido": "#4CAF50",
    "relendo": "#FF9800",
    "abandonado": "#F44336"
  }
  return colors[status] || "#666"
}

function getStatusText(status) {
  const texts = {
    "quero-ler": "Quero Ler",
    "lendo": "Lendo",
    "lido": "Lido",
    "relendo": "Relendo",
    "abandonado": "Abandonado"
  }
  return texts[status] || status
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa", padding: 16 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 4, color: "#22333b" },
  subheader: { fontSize: 14, color: "#555", marginBottom: 16 },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#22333b" },
  sectionDescription: { fontSize: 14, color: "#666", marginBottom: 16, lineHeight: 20 },
  primaryButton: {
    backgroundColor: "#22333b",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  empty: { textAlign: "center", color: "#777", marginTop: 10, fontStyle: "italic", lineHeight: 20 },

  recentBookItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#eee" },
  recentBookInfo: { flex: 1, marginRight: 12 },
  recentBookTitle: { fontWeight: "600", fontSize: 16, marginBottom: 4, color: "#22333b" },
  recentBookAuthor: { fontSize: 14, marginBottom: 4, color: "#555" },
  recentBookDetails: { fontSize: 12, fontStyle: "italic", color: "#777" },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, minWidth: 70, alignItems: "center" },
  statusText: { color: "#fff", fontSize: 10, fontWeight: "600" },

  profileSection: { marginBottom: 20 },
  profileHeader: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#c6ad8f", marginRight: 12 },
  username: { fontWeight: "700", fontSize: 16, color: "#22333b" },
  memberInfo: { fontSize: 12, color: "#666", marginBottom: 4 },
  stats: { fontSize: 12, color: "#666" },
})
