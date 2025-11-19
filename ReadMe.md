###### **Dokumentasi**

### Tech Stack
Frontend : Nodejs React  
Backend  : Golang

### Framework
Golang : Gin  
Install :
```bash
go get github.com/gin-gonic/gin
```

Banyak memakai Gin karena:

- **API stabil**  
- **Middleware lengkap**  
- **Dokumentasi rapi**  
- **Banyak package pihak ketiga kompatibel**  
- Framework baru seperti Fiber lebih cepat, tapi belum se-mature Gin

### Middleware Bawaan Gin
Gin memiliki middleware bawaan yang powerful, seperti:

- Logger (request log)  
- Recovery (mencegah crash saat panic)  
- Bind JSON otomatis  
- Validation menggunakan `validator.v10`  
- Sessions  
- CORS middleware (langsung pakai, tidak perlu setup manual)

### Struktur Proyek & Skalabilitas
Gin cocok digunakan untuk:

- microservices  
- REST API  
- backend mobile  
- backend marketplace  
- backend ERP atau sistem manajemen gudang  

Karena routing Gin sangat rapi dan mudah dibagi per module.


### Pengecekan Server jalan atau tidak
func main() {
	router := gin.Default()

	router.GET("/health", func(context *gin.Context) {
		context.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	if err := router.Run(":8080"); err != nil {
		log.Fatal("cannot start server: ", err)
	}
}

go run main.go

