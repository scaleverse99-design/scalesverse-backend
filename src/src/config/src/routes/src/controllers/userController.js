import { supabase } from '../config/database.js'

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, company, role } = req.body

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required'
      })
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          phone,
          company: company || null,
          role: role || 'Sales Representative',
          created_at: new Date().toISOString(),
          status: 'active'
        }
      ])
      .select()

    if (error) throw error

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: data[0]
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    })
  }
}

export const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({
      success: true,
      count: data.length,
      data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    })
  }
}
