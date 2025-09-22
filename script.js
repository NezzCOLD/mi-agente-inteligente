// Aplicación de Lista de Tareas
class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.currentFilter = 'all';
        this.currentCategoryFilter = 'all';
        this.searchTerm = '';
        
        this.initializeElements();
        this.bindEvents();
        this.render();
        
        // Verificar tareas vencidas cada minuto
        this.startOverdueChecker();
    }

    // Inicializar elementos del DOM
    initializeElements() {
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.categorySelect = document.getElementById('category-select');
        this.categoryOptions = document.getElementById('category-options');
        this.prioritySelect = document.getElementById('priority-select');
        this.priorityOptions = document.getElementById('priority-options');
        this.dueDatetime = document.getElementById('due-datetime');
        this.todoList = document.getElementById('todo-list');
        this.searchInput = document.getElementById('search-input');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.categoryFilterButtons = document.querySelectorAll('.category-filter-btn');
        this.priorityFilterButtons = document.querySelectorAll('.priority-filter-btn');
        this.emptyState = document.getElementById('empty-state');
        this.totalTasks = document.getElementById('total-tasks');
        this.completedTasks = document.getElementById('completed-tasks');
        this.pendingTasks = document.getElementById('pending-tasks');
        this.overdueTasks = document.getElementById('overdue-tasks');
        
        // Estado del dropdown
        this.selectedCategory = '';
        this.selectedPriority = '';
        this.currentPriorityFilter = 'all';
    }

    // Vincular eventos
    bindEvents() {
        // Formulario para agregar tareas
        this.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // Búsqueda
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.render();
        });

        // Filtros
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Filtros de categoría - se manejan dinámicamente
        this.bindCategoryFilterEvents();

        // Dropdown de prioridades personalizado
        this.prioritySelect.addEventListener('click', () => {
            this.priorityOptions.classList.toggle('show');
            this.categoryOptions.classList.remove('show');
        });

        this.priorityOptions.addEventListener('click', (e) => {
            const option = e.target.closest('.priority-option');
            if (option) {
                this.selectPriority(option.dataset.value, option);
            }
        });

        // Filtros de prioridad
        this.priorityFilterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setPriorityFilter(e.target.dataset.priority);
            });
        });


        // Dropdown de categorías personalizado
        this.categoryOptions.addEventListener('click', (e) => {
            const option = e.target.closest('.category-option');
            if (option) {
                this.selectCategory(option.dataset.value, option);
            }
        });

        // Eventos delegados para la lista de tareas
        this.todoList.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;

            const todoId = parseInt(todoItem.dataset.id);

            if (e.target.classList.contains('todo-checkbox')) {
                this.toggleTodo(todoId);
            } else if (e.target.closest('.edit-btn')) {
                this.editTodo(todoId);
            } else if (e.target.closest('.delete-btn')) {
                this.deleteTodo(todoId);
            }
        });
    }

    // Agregar nueva tarea
    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const category = this.selectedCategory;
        const dueDateTime = this.dueDatetime.value;
        const priority = this.selectedPriority;
        
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            dueDateTime: dueDateTime || null,
            category: category || 'otro',
            priority: priority || 'media'
        };

        this.todos.unshift(newTodo);
        this.todoInput.value = '';
        this.selectedCategory = '';
        this.selectedPriority = '';
        this.updateCategoryDisplay();
        this.updatePriorityDisplay();
        this.dueDatetime.value = '';
        this.saveTodos();
        this.render();
        this.showNotification('Tarea agregada exitosamente', 'success');
    }

    // Marcar/desmarcar tarea como completada
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            // No permitir marcar como completada una tarea vencida
            if (this.isOverdue(todo) && !todo.completed) {
                this.showNotification('No se puede marcar como completada una tarea vencida', 'warning');
                return;
            }
            
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
            this.showNotification(
                todo.completed ? 'Tarea completada' : 'Tarea marcada como pendiente', 
                'info'
            );
        }
    }

    // Editar tarea
    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        const newText = prompt('Editar tarea:', todo.text);
        if (newText && newText.trim() !== '' && newText.trim() !== todo.text) {
            todo.text = newText.trim();
            this.saveTodos();
            this.render();
            this.showNotification('Tarea actualizada', 'success');
        }
    }

    // Eliminar tarea
    deleteTodo(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveTodos();
            this.render();
            this.showNotification('Tarea eliminada', 'warning');
        }
    }

    // Establecer filtro
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Actualizar botones de filtro
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.render();
    }

    // Establecer filtro de categoría
    setCategoryFilter(category) {
        this.currentCategoryFilter = category;
        this.render();
    }

    // Seleccionar categoría del dropdown
    selectCategory(categoryValue, optionElement) {
        this.selectedCategory = categoryValue;
        
        // Actualizar visualización
        this.updateCategoryDisplay();
        
        // Marcar opción como seleccionada
        this.categoryOptions.querySelectorAll('.category-option').forEach(option => {
            option.classList.remove('selected');
        });
        optionElement.classList.add('selected');
    }

    // Actualizar la visualización del dropdown
    updateCategoryDisplay() {
        const categoryText = this.categorySelect.querySelector('.category-text');
        if (this.selectedCategory) {
            const categoryNames = {
                'trabajo': '💼 Trabajo',
                'personal': '👤 Personal',
                'estudio': '📚 Estudio',
                'casa': '🏠 Casa',
                'salud': '💪 Salud',
                'hobbies': '🎨 Hobbies',
                'compras': '🛒 Compras',
                'otro': '📝 Otro'
            };
            categoryText.textContent = categoryNames[this.selectedCategory] || 'Seleccionar categoría';
        } else {
            categoryText.textContent = 'Seleccionar categoría';
        }
    }

    // Verificar si una tarea está vencida
    isOverdue(todo) {
        if (!todo.dueDateTime) return false;
        const now = new Date();
        const dueDate = new Date(todo.dueDateTime);
        return dueDate < now && !todo.completed;
    }

    // Verificar si una tarea está próxima a vencer (en las próximas 24 horas)
    isDueSoon(todo) {
        if (!todo.dueDateTime || todo.completed) return false;
        const now = new Date();
        const dueDate = new Date(todo.dueDateTime);
        const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
        return hoursUntilDue <= 24 && hoursUntilDue > 0;
    }

    // Marcar tareas vencidas automáticamente
    checkOverdueTodos() {
        let hasChanges = false;
        
        this.todos.forEach(todo => {
            if (this.isOverdue(todo) && todo.completed) {
                todo.completed = false;
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            this.saveTodos();
            this.showNotification('Algunas tareas vencidas han sido marcadas como no completadas', 'warning');
        }
        
        return hasChanges;
    }

    // Iniciar verificador de tareas vencidas
    startOverdueChecker() {
        // Verificar cada segundo para máxima fluidez
        setInterval(() => {
            this.checkOverdueTodos();
            this.updateStats(); // Solo actualizar estadísticas
            this.updateTodoItems(); // Actualizar solo los elementos de tareas existentes
        }, 1000); // 1 segundo
        
        // Verificar inmediatamente al cargar
        setTimeout(() => {
            this.checkOverdueTodos();
            this.render();
        }, 100);
    }

    // Obtener tareas filtradas
    getFilteredTodos() {
        let filtered = this.todos;

        // Aplicar filtro de estado
        if (this.currentFilter === 'completed') {
            filtered = filtered.filter(todo => todo.completed);
        } else if (this.currentFilter === 'pending') {
            // Las tareas pendientes no incluyen las vencidas
            filtered = filtered.filter(todo => !todo.completed && !this.isOverdue(todo));
        } else if (this.currentFilter === 'overdue') {
            filtered = filtered.filter(todo => this.isOverdue(todo));
        }

        // Aplicar filtro de categoría
        if (this.currentCategoryFilter !== 'all') {
            filtered = filtered.filter(todo => todo.category === this.currentCategoryFilter);
        }

        // Aplicar filtro de prioridad
        if (this.currentPriorityFilter !== 'all') {
            filtered = filtered.filter(todo => todo.priority === this.currentPriorityFilter);
        }

        // Aplicar búsqueda
        if (this.searchTerm) {
            filtered = filtered.filter(todo => 
                todo.text.toLowerCase().includes(this.searchTerm)
            );
        }

        return filtered;
    }

    // Actualizar solo los elementos de tareas existentes
    updateTodoItems() {
        const todoItems = this.todoList.querySelectorAll('.todo-item');
        let hasChanges = false;
        
        todoItems.forEach(item => {
            const todoId = parseInt(item.dataset.id);
            const todo = this.todos.find(t => t.id === todoId);
            if (todo) {
                const wasChanged = this.updateTodoItemElement(item, todo);
                if (wasChanged) hasChanges = true;
            }
        });
        
        return hasChanges;
    }

    // Actualizar un elemento de tarea específico
    updateTodoItemElement(element, todo) {
        const isOverdue = this.isOverdue(todo);
        const isDueSoon = this.isDueSoon(todo);
        let hasChanges = false;
        
        // Actualizar clases
        let className = 'todo-item';
        if (todo.completed) className += ' completed';
        if (isOverdue) className += ' overdue';
        else if (isDueSoon) className += ' due-soon';
        
        if (element.className !== className) {
            element.className = className;
            hasChanges = true;
        }

        // Actualizar checkbox
        const checkbox = element.querySelector('.todo-checkbox');
        const shouldBeChecked = todo.completed;
        const isCurrentlyChecked = checkbox.classList.contains('checked');
        
        if (shouldBeChecked !== isCurrentlyChecked) {
            if (shouldBeChecked) {
                checkbox.classList.add('checked');
                checkbox.innerHTML = '<i class="fas fa-check"></i>';
            } else {
                checkbox.classList.remove('checked');
                checkbox.innerHTML = '';
            }
            hasChanges = true;
        }

        // Actualizar fecha de vencimiento
        const dueDateElement = element.querySelector('.todo-due-date');
        if (todo.dueDateTime) {
            let dueDateClass = 'todo-due-date';
            let newContent = '';
            
            if (todo.completed) {
                // Si está completada, solo mostrar "Completada"
                dueDateClass += ' completed';
                newContent = `<i class="fas fa-check-circle"></i> Tarea Completada`;
            } else {
                // Si no está completada, mostrar el tiempo restante
                const dueDate = new Date(todo.dueDateTime);
                const formattedDate = this.formatDateTime(dueDate);
                
                if (isOverdue) {
                    dueDateClass += ' overdue';
                } else if (isDueSoon) {
                    dueDateClass += ' due-soon';
                }
                
                newContent = `<i class="fas fa-clock"></i> ${formattedDate}`;
            }
            
            if (dueDateElement) {
                if (dueDateElement.className !== dueDateClass || dueDateElement.innerHTML !== newContent) {
                    dueDateElement.className = dueDateClass;
                    dueDateElement.innerHTML = newContent;
                    hasChanges = true;
                }
            } else {
                // Crear elemento de fecha si no existe
                const todoContent = element.querySelector('.todo-content');
                if (todoContent) {
                    const newDueDateElement = document.createElement('div');
                    newDueDateElement.className = dueDateClass;
                    newDueDateElement.innerHTML = newContent;
                    todoContent.appendChild(newDueDateElement);
                    hasChanges = true;
                }
            }
        } else if (dueDateElement) {
            // Remover elemento de fecha si no hay fecha de vencimiento
            dueDateElement.remove();
            hasChanges = true;
        }
        
        return hasChanges;
    }

    // Renderizar la aplicación
    render() {
        // Verificar tareas vencidas antes de renderizar
        this.checkOverdueTodos();
        
        const filteredTodos = this.getFilteredTodos();
        
        // Limpiar lista
        this.todoList.innerHTML = '';

        // Mostrar tareas o estado vacío
        if (filteredTodos.length === 0) {
            this.showEmptyState();
        } else {
            this.hideEmptyState();
            filteredTodos.forEach(todo => {
                this.todoList.appendChild(this.createTodoElement(todo));
            });
        }

        // Actualizar botones de filtro de categorías dinámicamente
        this.updateCategoryFilterButtons();

        // Actualizar estadísticas
        this.updateStats();
    }

    // Crear elemento HTML para una tarea
    createTodoElement(todo) {
        const li = document.createElement('li');
        const isOverdue = this.isOverdue(todo);
        const isDueSoon = this.isDueSoon(todo);
        
        let className = 'todo-item';
        if (todo.completed) className += ' completed';
        if (isOverdue) className += ' overdue';
        else if (isDueSoon) className += ' due-soon';
        
        li.className = className;
        li.dataset.id = todo.id;

        // Formatear fecha de vencimiento
        let dueDateHtml = '';
        if (todo.dueDateTime) {
            let dueDateClass = 'todo-due-date';
            let content = '';
            
            if (todo.completed) {
                // Si está completada, solo mostrar "Completada"
                dueDateClass += ' completed';
                content = `<i class="fas fa-check-circle"></i> Completada`;
            } else {
                // Si no está completada, mostrar el tiempo restante
                const dueDate = new Date(todo.dueDateTime);
                const formattedDate = this.formatDateTime(dueDate);
                
                if (isOverdue) {
                    dueDateClass += ' overdue';
                } else if (isDueSoon) {
                    dueDateClass += ' due-soon';
                }
                
                content = `<i class="fas fa-clock"></i> ${formattedDate}`;
            }
            
            dueDateHtml = `
                <div class="${dueDateClass}">
                    ${content}
                </div>
            `;
        }

        // Formatear categoría
        const categoryHtml = todo.category ? 
            `<div class="todo-category ${todo.category}">${this.getCategoryDisplayName(todo.category)}</div>` : '';

        // Formatear prioridad
        const priorityHtml = todo.priority ? 
            `<div class="todo-priority ${todo.priority}">${this.getPriorityDisplayName(todo.priority)}</div>` : '';

        li.innerHTML = `
            <div class="todo-checkbox ${todo.completed ? 'checked' : ''} ${isOverdue && !todo.completed ? 'disabled' : ''}">
                ${todo.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="todo-content">
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <div class="todo-meta">
                    ${categoryHtml}
                    ${priorityHtml}
                </div>
                ${dueDateHtml}
            </div>
            <div class="todo-actions">
                <button class="action-btn edit-btn" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        return li;
    }

    // Mostrar estado vacío
    showEmptyState() {
        this.emptyState.style.display = 'block';
        this.todoList.style.display = 'none';
    }

    // Ocultar estado vacío
    hideEmptyState() {
        this.emptyState.style.display = 'none';
        this.todoList.style.display = 'block';
    }

    // Formatear fecha y hora
    formatDateTime(date) {
        const now = new Date();
        const diffInHours = (date - now) / (1000 * 60 * 60);
        
        if (diffInHours < 0) {
            // Tarea vencida
            const diffInDays = Math.abs(Math.floor(diffInHours / 24));
            if (diffInDays === 0) {
                return `Venció hoy a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
            } else {
                const dayNumber = date.getDate();
                return `Venció el ${dayNumber} a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
            }
        } else if (diffInHours < 1) {
            // Próxima a vencer (menos de 1 hora)
            const minutes = Math.floor(diffInHours * 60);
            const seconds = Math.floor((diffInHours * 60 - minutes) * 60);
            if (minutes === 0) {
                return `Vence en ${seconds} seg`;
            } else {
                return `Vence en ${minutes} min ${seconds} seg`;
            }
        } else if (diffInHours < 24) {
            // Próxima a vencer (menos de 24 horas)
            const hours = Math.floor(diffInHours);
            const minutes = Math.floor((diffInHours - hours) * 60);
            return `Vence en ${hours}h ${minutes}min`;
        } else {
            // Fecha futura
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays === 1) {
                return `Vence mañana a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
            } else if (diffInDays < 7) {
                return `Vence en ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
            } else {
                return `Vence el ${date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}`;
            }
        }
    }

    // Actualizar estadísticas
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = this.todos.filter(t => !t.completed && !this.isOverdue(t)).length;
        const overdue = this.todos.filter(t => this.isOverdue(t)).length;

        // Solo actualizar si los valores han cambiado
        const newTotalText = `${total} tarea${total !== 1 ? 's' : ''}`;
        const newCompletedText = `${completed} completada${completed !== 1 ? 's' : ''}`;
        const newPendingText = `${pending} pendiente${pending !== 1 ? 's' : ''}`;
        const newOverdueText = `${overdue} vencida${overdue !== 1 ? 's' : ''}`;

        if (this.totalTasks.textContent !== newTotalText) {
            this.totalTasks.textContent = newTotalText;
        }
        if (this.completedTasks.textContent !== newCompletedText) {
            this.completedTasks.textContent = newCompletedText;
        }
        if (this.pendingTasks.textContent !== newPendingText) {
            this.pendingTasks.textContent = newPendingText;
        }
        if (this.overdueTasks.textContent !== newOverdueText) {
            this.overdueTasks.textContent = newOverdueText;
        }
    }

    // Guardar tareas en localStorage
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    // Cargar tareas desde localStorage
    loadTodos() {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [];
    }

    // Escapar HTML para prevenir XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Obtener nombre de visualización de la categoría
    getCategoryDisplayName(category) {
        const categoryNames = {
            'trabajo': 'TRABAJO',
            'personal': 'PERSONAL',
            'estudio': 'ESTUDIO',
            'casa': 'CASA',
            'salud': 'SALUD',
            'hobbies': 'HOBBIES',
            'compras': 'COMPRAS',
            'otro': 'OTRO'
        };
        return categoryNames[category] || 'OTRO';
    }

    // Obtener categorías activas (que tienen tareas)
    getActiveCategories() {
        const activeCategories = new Set();
        this.todos.forEach(todo => {
            if (todo.category) {
                activeCategories.add(todo.category);
            }
        });
        return Array.from(activeCategories);
    }

    // Actualizar botones de filtro de categorías dinámicamente
    updateCategoryFilterButtons() {
        const categoryFilterContainer = document.querySelector('.category-filters');
        if (!categoryFilterContainer) return;

        // Obtener categorías activas
        const activeCategories = this.getActiveCategories();
        
        // Crear HTML para los botones de filtro
        let filterButtonsHtml = `
            <button class="category-filter-btn ${this.currentCategoryFilter === 'all' ? 'active' : ''}" 
                    data-category="all">
                <i class="fas fa-th"></i>
                Todas las categorías
            </button>
        `;

        // Agregar botones para cada categoría activa
        activeCategories.forEach(category => {
            const isActive = this.currentCategoryFilter === category;
            const icon = this.getCategoryIcon(category);
            const displayName = this.getCategoryDisplayName(category);
            
            filterButtonsHtml += `
                <button class="category-filter-btn ${isActive ? 'active' : ''}" 
                        data-category="${category}">
                    <span class="category-icon">${icon}</span>
                    ${displayName}
                </button>
            `;
        });

        // Actualizar el HTML
        categoryFilterContainer.innerHTML = filterButtonsHtml;

        // Re-vincular eventos
        this.bindCategoryFilterEvents();
    }

    // Obtener icono de categoría
    getCategoryIcon(category) {
        const categoryIcons = {
            'trabajo': '💼',
            'personal': '👤',
            'estudio': '📚',
            'casa': '🏠',
            'salud': '🏥',
            'hobbies': '🎨',
            'compras': '🛒',
            'otro': '📝'
        };
        return categoryIcons[category] || '📝';
    }

    // Vincular eventos de filtros de categorías
    bindCategoryFilterEvents() {
        const categoryFilterButtons = document.querySelectorAll('.category-filter-btn');
        categoryFilterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.setCategoryFilter(category);
            });
        });
    }

    // Seleccionar prioridad del dropdown
    selectPriority(priorityValue, optionElement) {
        this.selectedPriority = priorityValue;
        
        // Actualizar display del dropdown
        this.updatePriorityDisplay();
        
        // Cerrar dropdown
        this.priorityOptions.classList.remove('show');
        
        // Marcar opción seleccionada
        this.priorityOptions.querySelectorAll('.priority-option').forEach(option => {
            option.classList.remove('selected');
        });
        optionElement.classList.add('selected');
    }

    // Actualizar display del dropdown de prioridades
    updatePriorityDisplay() {
        const priorityText = this.prioritySelect.querySelector('.priority-text');
        if (this.selectedPriority) {
            const priorityNames = {
                'alta': '🔴 Alta',
                'media': '🟡 Media',
                'baja': '🟢 Baja'
            };
            priorityText.textContent = priorityNames[this.selectedPriority];
        } else {
            priorityText.textContent = 'Seleccionar prioridad';
        }
    }

    // Establecer filtro de prioridad
    setPriorityFilter(priority) {
        this.currentPriorityFilter = priority;
        
        // Actualizar botones de filtro de prioridad
        this.priorityFilterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.priority === priority);
        });

        this.render();
    }

    // Obtener nombre de visualización de la prioridad
    getPriorityDisplayName(priority) {
        const priorityNames = {
            'alta': 'ALTA',
            'media': 'MEDIA',
            'baja': 'BAJA'
        };
        return priorityNames[priority] || 'MEDIA';
    }



    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Estilos para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: this.getNotificationColor(type),
            color: 'white',
            padding: '15px 20px',
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '500',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Obtener icono para notificación
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Obtener color para notificación
    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || '#17a2b8';
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Agregar algunos estilos adicionales para las notificaciones
const style = document.createElement('style');
style.textContent = `
    .notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
`;
document.head.appendChild(style);
