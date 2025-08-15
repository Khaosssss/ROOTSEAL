import { useState } from 'react';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

function MerkleGenerator() {
  const [leaves, setLeaves] = useState([]);
  const [merkleRoot, setMerkleRoot] = useState('');
  const [newLeaf, setNewLeaf] = useState('');

  const generateMerkleTree = (dataArray) => {
    // Convert leaves to hash values using keccak256
    const hashedLeaves = dataArray.map(leaf => keccak256(leaf));
    
    // Create new Merkle tree
    const merkleTree = new MerkleTree(hashedLeaves, keccak256, {
      sortPairs: true // Keep tree deterministic
    });
    
    // Get root hash
    const root = merkleTree.getHexRoot();
    return root;
  };

  const addLeaf = (e) => {
    e.preventDefault();
    if (!newLeaf.trim()) return;

    const updatedLeaves = [...leaves, newLeaf];
    setLeaves(updatedLeaves);
    
    // Generate new root after adding leaf
    const root = generateMerkleTree(updatedLeaves);
    setMerkleRoot(root);
    setNewLeaf('');
  };

  return (
    <div className="merkle-generator">
      <h2>Merkle Tree Generator</h2>
      
      <form onSubmit={addLeaf}>
        <input 
          type="text"
          value={newLeaf}
          onChange={(e) => setNewLeaf(e.target.value)}
          placeholder="Enter data for new leaf"
        />
        <button type="submit">Add Leaf</button>
      </form>

      <div className="merkle-info">
        <h3>Current Leaves:</h3>
        <ul>
          {leaves.map((leaf, index) => (
            <li key={index}>{leaf}</li>
          ))}
        </ul>

        <h3>Merkle Root:</h3>
        <p className="root">{merkleRoot || 'No root generated yet'}</p>
      </div>
    </div>
  );
}

export default MerkleGenerator;