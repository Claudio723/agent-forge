-- Phase 3: Update vault RPC functions (encrypt + decrypt)

-- Drop old seed function if it exists
DROP FUNCTION IF EXISTS public.seed_encrypt_key(UUID, TEXT, TEXT, TEXT, TEXT);

-- Encrypt and store an API key
CREATE OR REPLACE FUNCTION public.encrypt_and_store_key(
  p_user_id UUID,
  p_alias TEXT,
  p_service TEXT,
  p_plain_key TEXT,
  p_encryption_password TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.api_vault (user_id, alias, encrypted_key, service)
  VALUES (
    p_user_id,
    p_alias,
    pgp_sym_encrypt(p_plain_key, p_encryption_password),
    p_service
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrypt a stored API key (returns plaintext)
CREATE OR REPLACE FUNCTION public.decrypt_vault_key(
  p_entry_id UUID,
  p_user_id UUID,
  p_encryption_password TEXT
) RETURNS TEXT AS $$
DECLARE
  v_encrypted BYTEA;
  v_plain TEXT;
BEGIN
  SELECT encrypted_key INTO v_encrypted
  FROM public.api_vault
  WHERE id = p_entry_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Key not found or access denied';
  END IF;

  v_plain := pgp_sym_decrypt(v_encrypted, p_encryption_password);
  RETURN v_plain;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
