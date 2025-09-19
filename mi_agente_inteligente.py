# Mi Agente Inteligente - Versión 1.0
# Este agente puede calcular el año exacto de nacimiento

import tkinter as tk
from tkinter import messagebox
from datetime import datetime

class MiAgenteInteligente:
    def __init__(self):
        # Crear la ventana principal
        self.ventana = tk.Tk()
        self.ventana.title("🤖 Mi Agente Inteligente v2.0 - Consejero Personal")
        self.ventana.geometry("600x500")
        self.ventana.configure(bg='#f0f0f0')
        
        # Crear los elementos de la ventana
        self.crear_interfaz()
        
    def crear_interfaz(self):
        # Título
        titulo = tk.Label(
            self.ventana, 
            text="🤖 Mi Agente Inteligente v2.0", 
            font=("Arial", 18, "bold"),
            bg='#f0f0f0',
            fg='#333'
        )
        titulo.pack(pady=20)
        
        # Información del agente
        info = tk.Label(
            self.ventana, 
            text="¡Hola! Soy tu agente consejero personal. Te ayudo a analizar tu información y darte consejos útiles.", 
            font=("Arial", 12),
            bg='#f0f0f0',
            fg='#666'
        )
        info.pack(pady=10)
        
        # Campo para el nombre
        tk.Label(self.ventana, text="👤 ¿Cómo te llamas?", font=("Arial", 12, "bold"), bg='#f0f0f0').pack(pady=5)
        self.campo_nombre = tk.Entry(self.ventana, font=("Arial", 12), width=40)
        self.campo_nombre.pack(pady=5)
        
        # Campo para la edad
        tk.Label(self.ventana, text="🎂 ¿Cuántos años tienes?", font=("Arial", 12, "bold"), bg='#f0f0f0').pack(pady=5)
        self.campo_edad = tk.Entry(self.ventana, font=("Arial", 12), width=40)
        self.campo_edad.pack(pady=5)
        
        # Campo para el mes de nacimiento
        tk.Label(self.ventana, text="📅 ¿En qué mes naciste? (1-12)", font=("Arial", 12, "bold"), bg='#f0f0f0').pack(pady=5)
        self.campo_mes = tk.Entry(self.ventana, font=("Arial", 12), width=40)
        self.campo_mes.pack(pady=5)
        
        # Campo para el día de nacimiento
        tk.Label(self.ventana, text="📅 ¿En qué día naciste? (1-31)", font=("Arial", 12, "bold"), bg='#f0f0f0').pack(pady=5)
        self.campo_dia = tk.Entry(self.ventana, font=("Arial", 12), width=40)
        self.campo_dia.pack(pady=5)
        
        # Botón para procesar
        boton = tk.Button(
            self.ventana, 
            text="🚀 ¡Procesar con mi agente!", 
            command=self.procesar_informacion,
            font=("Arial", 14, "bold"),
            bg='#4CAF50',
            fg='white',
            padx=30,
            pady=15
        )
        boton.pack(pady=20)
        
        # Área de resultados
        self.resultado = tk.Text(
            self.ventana, 
            height=12, 
            width=70, 
            font=("Arial", 11),
            bg='#fff',
            fg='#333',
            wrap=tk.WORD
        )
        self.resultado.pack(pady=10)
        
    def saludar(self, nombre):
        """Esta función dice hola a alguien"""
        return f"¡Hola {nombre}! Soy tu agente inteligente 🤖"
    
    def calcular_año_nacimiento_exacto(self, edad, mes, dia):
        """Esta función calcula el año exacto de nacimiento"""
        año_actual = datetime.now().year
        mes_actual = datetime.now().month
        dia_actual = datetime.now().day
        
        # Verificar si ya cumplió años este año
        if mes_actual > mes or (mes_actual == mes and dia_actual >= dia):
            año_nacimiento = año_actual - edad
        else:
            año_nacimiento = año_actual - edad - 1
            
        return año_nacimiento
    
    def obtener_signo_zodiacal(self, mes, dia):
        """Esta función determina el signo zodiacal"""
        signos = [
            (1, 20, "Capricornio"), (2, 19, "Acuario"), (3, 21, "Piscis"),
            (4, 20, "Aries"), (5, 21, "Tauro"), (6, 21, "Géminis"),
            (7, 23, "Cáncer"), (8, 23, "Leo"), (9, 23, "Virgo"),
            (10, 23, "Libra"), (11, 22, "Escorpio"), (12, 22, "Sagitario")
        ]
        
        for i, (mes_signo, dia_signo, nombre) in enumerate(signos):
            if mes < mes_signo or (mes == mes_signo and dia <= dia_signo):
                return nombre
        return "Capricornio"  # Si no encuentra nada, es Capricornio
    
    def analizar_etapa_vida(self, edad):
        """Esta función analiza en qué etapa de vida estás"""
        if edad < 13:
            return "👶 Niñez", "Estás en la etapa de niñez. ¡Disfruta jugando y aprendiendo!"
        elif edad < 18:
            return "🧑 Adolescencia", "Estás en la adolescencia. ¡Es momento de explorar y descubrir quién eres!"
        elif edad < 25:
            return "👨‍🎓 Joven adulto", "Estás en la juventud. ¡Es el momento perfecto para estudiar y experimentar!"
        elif edad < 35:
            return "👨‍💼 Adulto joven", "Estás en la adultez temprana. ¡Es hora de construir tu carrera y relaciones!"
        elif edad < 50:
            return "👨‍💼 Adulto maduro", "Estás en la adultez media. ¡Es momento de consolidar y crecer!"
        elif edad < 65:
            return "👨‍💼 Adulto mayor", "Estás en la adultez tardía. ¡Es hora de disfrutar y compartir experiencia!"
        else:
            return "👴 Tercera edad", "Estás en la tercera edad. ¡Es momento de sabiduría y tranquilidad!"
    
    def recomendar_carrera(self, edad):
        """Esta función recomienda carreras según tu edad"""
        if edad < 18:
            return "📚 Estudios básicos", "¡Enfócate en terminar la secundaria! Es la base para todo lo demás."
        elif edad < 25:
            return "🎓 Universidad", "¡Es el momento perfecto para estudiar una carrera universitaria!"
        elif edad < 35:
            return "💼 Especialización", "¡Considera hacer una maestría o especialización en tu área!"
        elif edad < 50:
            return "👑 Liderazgo", "¡Es hora de buscar posiciones de liderazgo y mentoría!"
        else:
            return "🎯 Consultoría", "¡Tu experiencia es valiosa! Considera ser consultor o mentor."
    
    def dar_consejos_salud(self, edad):
        """Esta función da consejos de salud según la edad"""
        if edad < 18:
            return "🍎 Alimentación sana", "¡Come frutas y verduras! Haz ejercicio y duerme bien."
        elif edad < 30:
            return "💪 Ejercicio regular", "¡Mantén una rutina de ejercicio! Es el momento perfecto para crear buenos hábitos."
        elif edad < 50:
            return "🏥 Chequeos médicos", "¡No olvides tus chequeos anuales! La prevención es clave."
        else:
            return "🧘 Bienestar integral", "¡Cuida tu mente y cuerpo! La meditación y el ejercicio suave son excelentes."
    
    def sugerir_actividades(self, edad):
        """Esta función sugiere actividades según la edad"""
        if edad < 18:
            return "🎮 Deportes y juegos", "¡Practica deportes, lee libros y explora tus intereses!"
        elif edad < 30:
            return "🌍 Viajes y experiencias", "¡Viaja, conoce gente nueva y experimenta cosas diferentes!"
        elif edad < 50:
            return "👨‍👩‍👧‍👦 Familia y carrera", "¡Disfruta con tu familia y enfócate en crecer profesionalmente!"
        else:
            return "🎨 Hobbies y sabiduría", "¡Dedica tiempo a tus pasatiempos y comparte tu experiencia con otros!"
    
    def procesar_informacion(self):
        """Esta función procesa la información que ingresaste"""
        # Obtener la información que escribiste
        nombre = self.campo_nombre.get().strip()
        edad_texto = self.campo_edad.get().strip()
        mes_texto = self.campo_mes.get().strip()
        dia_texto = self.campo_dia.get().strip()
        
        # Verificar que hayas escrito algo
        if not nombre or not edad_texto or not mes_texto or not dia_texto:
            messagebox.showwarning("⚠️ Atención", "Por favor, completa todos los campos")
            return
        
        try:
            edad = int(edad_texto)
            mes = int(mes_texto)
            dia = int(dia_texto)
        except ValueError:
            messagebox.showerror("❌ Error", "Por favor, escribe números válidos")
            return
        
        # Verificar rangos válidos
        if not (1 <= mes <= 12):
            messagebox.showerror("❌ Error", "El mes debe estar entre 1 y 12")
            return
        
        if not (1 <= dia <= 31):
            messagebox.showerror("❌ Error", "El día debe estar entre 1 y 31")
            return
        
        # Limpiar el área de resultados
        self.resultado.delete(1.0, tk.END)
        
        # Procesar la información
        resultado = f"🤖 ¡Hola! Soy tu agente inteligente\n"
        resultado += "=" * 50 + "\n\n"
        
        # Saludar
        saludo = self.saludar(nombre)
        resultado += f"👋 {saludo}\n\n"
        
        # Mostrar información personal
        resultado += f"📊 INFORMACIÓN PERSONAL:\n"
        resultado += f"   👤 Nombre: {nombre}\n"
        resultado += f"   🎂 Edad: {edad} años\n"
        resultado += f"   📅 Fecha de nacimiento: {dia}/{mes}\n\n"
        
        # Calcular año de nacimiento exacto
        año_nacimiento = self.calcular_año_nacimiento_exacto(edad, mes, dia)
        resultado += f"🎯 CÁLCULOS PRECISOS:\n"
        resultado += f"   📅 Año de nacimiento: {año_nacimiento}\n"
        resultado += f"   📅 Fecha completa: {dia}/{mes}/{año_nacimiento}\n\n"
        
        # Análisis inteligente de etapa de vida
        etapa, descripcion_etapa = self.analizar_etapa_vida(edad)
        resultado += f"🧠 ANÁLISIS INTELIGENTE:\n"
        resultado += f"   {etapa}: {descripcion_etapa}\n\n"
        
        # Recomendaciones de carrera
        carrera, consejo_carrera = self.recomendar_carrera(edad)
        resultado += f"💼 RECOMENDACIONES DE CARRERA:\n"
        resultado += f"   {carrera}: {consejo_carrera}\n\n"
        
        # Consejos de salud
        salud, consejo_salud = self.dar_consejos_salud(edad)
        resultado += f"🏥 CONSEJOS DE SALUD:\n"
        resultado += f"   {salud}: {consejo_salud}\n\n"
        
        # Actividades sugeridas
        actividad, consejo_actividad = self.sugerir_actividades(edad)
        resultado += f"🎯 ACTIVIDADES RECOMENDADAS:\n"
        resultado += f"   {actividad}: {consejo_actividad}\n\n"
        
        # Información adicional
        signo = self.obtener_signo_zodiacal(mes, dia)
        resultado += f"♈ INFORMACIÓN ADICIONAL:\n"
        resultado += f"   🌟 Signo zodiacal: {signo}\n"
        
        # Categoría de edad
        if edad < 18:
            resultado += f"   👶 Categoría: Menor de edad\n"
        elif edad < 65:
            resultado += f"   👨‍💼 Categoría: Adulto\n"
        else:
            resultado += f"   👴 Categoría: Adulto mayor\n"
        
        resultado += f"\n🎉 ¡Análisis completado!\n"
        resultado += f"✅ Tu agente inteligente ha procesado toda la información de {nombre}"
        
        # Mostrar el resultado
        self.resultado.insert(tk.END, resultado)
        
        # Limpiar los campos
        self.campo_nombre.delete(0, tk.END)
        self.campo_edad.delete(0, tk.END)
        self.campo_mes.delete(0, tk.END)
        self.campo_dia.delete(0, tk.END)
    
    def ejecutar(self):
        """Ejecutar el agente"""
        self.ventana.mainloop()

# Crear y ejecutar el agente
if __name__ == "__main__":
    agente = MiAgenteInteligente()
    agente.ejecutar()
