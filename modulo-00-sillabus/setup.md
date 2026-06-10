# Setup del entorno — paso a paso

## Windows

### 1. VS Code

Descargá de https://code.visualstudio.com/. Next, next, finish.

Extensiones (abrí la panel de extensiones con `Ctrl+Shift+X`):
- **ESLint** (Microsoft)
- **Prettier** (Prettier)
- **Live Server** (Ritwick Dey)
- **Auto Rename Tag** (Jun Han)

Config recomendada (`Ctrl+,` → abrir `settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.fontSize": 14,
  "editor.minimap.enabled": false,
  "files.autoSave": "onFocusChange"
}
```

### 2. Git

Descargá de https://git-scm.com/download/win. Durante la instalación:
- Editor: usar VS Code.
- Resto: defaults.

Primera configuración:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git config --global init.defaultBranch main
```

### 3. Node.js

Descargá **LTS** (20+) de https://nodejs.org/. Next, next, finish.

Verificá:

```bash
node --version
npm --version
```

### 4. GitHub

1. Creá cuenta en https://github.com.
2. Configurá SSH (opcional pero recomendado):

```bash
ssh-keygen -t ed25519 -C "tu@email.com"
# Enter, enter, enter (deja defaults)
cat ~/.ssh/id_ed25519.pub
```

Copiá el output y pegalo en GitHub → Settings → SSH keys → New.

### 5. Terminal

En Windows usá **Git Bash** (viene con Git) para todos los comandos del curso. VS Code permite abrir terminal integrada: `` Ctrl+` ``.

---

## Verificación final

Creá una carpeta y:

```bash
mkdir hola-curso
cd hola-curso
echo '<h1>Hola</h1>' > index.html
git init
git add .
git commit -m "feat: primer commit del curso"
```

Si todo funcionó → estás listo.

---

## macOS / Linux

Similar al anterior, reemplazando:
- VS Code: https://code.visualstudio.com/ (hay paquete .dmg para Mac).
- Git: usualmente viene preinstalado. Si no, `brew install git` (Mac) o `apt install git` (Ubuntu).
- Node: descargá LTS de https://nodejs.org/ o usá **nvm** (https://github.com/nvm-sh/nvm) para manejar múltiples versiones.

---

## Recomendaciones de hábitos

1. **Un proyecto = una carpeta + un repo de Git**. Desde el día 1.
2. **Commits chicos y frecuentes**, con mensajes descriptivos.
3. **Leé los errores** antes de googlearlos.
4. **Probá cada línea de código** que escribís.
5. **No copies y pegues** sin entender qué hace.
