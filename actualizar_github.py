#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🤖 Script de actualización automática para GitHub
Este script actualiza automáticamente tu repositorio en GitHub
"""

import subprocess
import datetime
import os
import sys

def ejecutar_comando(comando):
    """Ejecuta un comando y muestra el resultado"""
    try:
        resultado = subprocess.run(comando, shell=True, capture_output=True, text=True)
        if resultado.returncode == 0:
            print(f"✅ {comando}")
            if resultado.stdout:
                print(resultado.stdout)
        else:
            print(f"❌ Error en: {comando}")
            if resultado.stderr:
                print(resultado.stderr)
        return resultado.returncode == 0
    except Exception as e:
        print(f"❌ Error ejecutando {comando}: {e}")
        return False

def actualizar_github():
    """Actualiza el repositorio en GitHub"""
    print("🤖 Actualizando repositorio en GitHub...")
    print("=" * 50)
    
    # Verificar que estamos en un repositorio Git
    if not os.path.exists('.git'):
        print("❌ Error: No estás en un repositorio Git")
        return False
    
    # Obtener timestamp
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Comandos a ejecutar
    comandos = [
        "git add .",
        f'git commit -m "🔄 Actualización automática - {timestamp}"',
        "git push origin main"
    ]
    
    # Ejecutar comandos
    for comando in comandos:
        if not ejecutar_comando(comando):
            print(f"❌ Falló el comando: {comando}")
            return False
    
    print("\n" + "=" * 50)
    print("✅ ¡Actualización completada!")
    print("🌐 Ve a: https://github.com/NezzCOLD/mi-agente-inteligente")
    print("=" * 50)
    
    return True

if __name__ == "__main__":
    print("🚀 Iniciando actualización automática...")
    print()
    
    if actualizar_github():
        print("\n🎉 ¡Proceso completado exitosamente!")
    else:
        print("\n❌ Hubo un error en el proceso")
        sys.exit(1)
