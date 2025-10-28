import numpy as np
from opensimplex import OpenSimplex

# --- Configuration ---
TEXTURE_SIZE = 64     # The dimension of the cube (e.g., 64x64x64 resolution)
NOISE_SCALE = 12.0    # Controls the "zoom" or feature size of the noise
NOISE_SEED = 42       # Seed for reproducible results

def generate_3d_simplex_texture(size, scale, noise_seed):
    """
    Generates a 3D numpy array filled with Simplex Noise values more efficiently.
    (This is the function you provided—it returns the data.)
    """
    print(f"Initializing Simplex Noise with seed: {noise_seed}")
    
    # 1. Initialize the OpenSimplex generator with the seed
    simplex_generator = OpenSimplex(seed=noise_seed)
    
    # 2. Create a 1D coordinate array (size elements)
    coords = np.linspace(0, scale, size, endpoint=False, dtype=np.float32)
    
    # 3. Create the 3D texture array to fill
    noise_texture = np.zeros((size, size, size), dtype=np.float32)
    
    print("Generating noise array (looping over coordinates)...")
    
    # 4. Loop through the array and sample the noise
    for x in range(size):
        for y in range(size):
            for z in range(size):
                # Calculate the scaled input coordinates for the noise function
                nx = coords[x]
                ny = coords[y]
                nz = coords[z]
                
                # Get the raw noise value (-1.0 to 1.0)
                raw_noise = simplex_generator.noise3(nx, ny, nz)
                
                # Store the raw noise value
                noise_texture[x, y, z] = raw_noise

    # 5. Normalize the noise array from [-1.0, 1.0] to [0.0, 1.0]
    print("Normalizing data...")
    noise_texture = (np.clip(noise_texture, -1.0, 1.0) + 1.0) / 2.0
    
    return noise_texture.astype(np.float32) 

def save_to_raw_binary(data, filename):
    """Saves the numpy array as a raw binary file."""
    
    # The crucial line: numpy's tofile() writes the raw byte data.
    data.tofile(filename) 
    
    print(f"\nSuccessfully saved {data.size} float32 values to: {filename}")
    print(f"Remember to use size={data.shape[0]} and THREE.FloatType in Three.js.")

# Execution
if __name__ == "__main__":
    
    print(f"Generating a {TEXTURE_SIZE}x{TEXTURE_SIZE}x{TEXTURE_SIZE} 3D Simplex Noise texture...")
    
    # 1. Generate the data (calls the function you reviewed)
    noise_texture = generate_3d_simplex_texture(
        size=TEXTURE_SIZE, 
        scale=NOISE_SCALE, 
        noise_seed=NOISE_SEED
    )
    
    print("Generation complete!")
    
    # 2. Define the output file name
    binary_filename = "3d_simplex_texture.bin"
    
    # 3. Save the texture to the file (calls the saving function)
    save_to_raw_binary(noise_texture, binary_filename)