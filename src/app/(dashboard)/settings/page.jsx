'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  async function handleChangePassword() {
    if (password !== confirm) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' })
      return
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Mínimo 6 caracteres.' })
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setMessage({ type: 'error', text: 'Error al cambiar la contraseña.' })
    } else {
      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' })
      setPassword('')
      setConfirm('')
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Ajustes</h1>
        <p className="text-muted-foreground mt-1">Administra tu cuenta.</p>
      </div>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Perfil</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="text-lg">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Administrador</p>
          </div>
        </CardContent>
      </Card>

      {/* Cambiar contraseña */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Cambiar contraseña
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Nueva contraseña</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Confirmar contraseña</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          </div>
          {message && (
            <p className={`text-sm ${message.type === 'error' ? 'text-destructive' : 'text-green-600'}`}>
              {message.text}
            </p>
          )}
          <Button onClick={handleChangePassword} disabled={loading} className="self-start">
            {loading ? 'Guardando...' : 'Actualizar contraseña'}
          </Button>
        </CardContent>
      </Card>

      {/* Info de la tienda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Información de la tienda
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Nombre de la tienda</Label>
            <Input defaultValue="Mi Tienda" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Moneda</Label>
            <Input defaultValue="USD" />
          </div>
          <Button variant="outline" className="self-start">Guardar cambios</Button>
        </CardContent>
      </Card>
    </div>
  )
}