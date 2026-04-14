// PasswordVault.svelte.js
export class PasswordVault {
  // Приватное реактивное состояние
  #value = $state('')
  #key = 'user_vault_password'

  constructor() {
    // Подгружаем пароль из localStorage при инициализации
    if (typeof window === 'undefined') {
      return
    }

    const saved = localStorage.getItem(this.#key)
    if (saved) {
      this.#value = saved
    }
  }

  // Геттер для получения значения
  get value() {
    return this.#value
  }

  // Сеттер для сохранения и записи в хранилище
  set value(newValue) {
    this.#value = newValue
    localStorage.setItem(this.#key, newValue)
  }

  // Метод для очистки
  clear() {
    this.#value = ''
    localStorage.removeItem(this.#key)
  }
}

// Экспортируем единственный экземпляр (Singleton)
export const passwordVault = new PasswordVault()
