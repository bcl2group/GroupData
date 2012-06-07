def mesh_to_disease_dict(useful_ids):
  mesh_disease_dict = {}
  #mappings = open('/scratch/vinnie/GEOPipelineFiles_ubuntu/HS_diseasesToGDSIDs.txt','r')
  mappings = open('/scratch/vinnie/GEOPipelineFiles_ubuntu/MM_diseasesToGDSIDs.txt','r')

  for line in mappings:
    line_array = line.split('\t')
    disease_name = line_array[0]
    mesh_name = disease_name.split(', ')
    disease_name = disease_name.replace(",", "")
    disease_name = disease_name.replace(" ", "_")

    if disease_name in useful_ids:
      mesh_name.reverse()
      mesh_name = "_".join(mesh_name)
      mesh_name = mesh_name.replace(" ", "_")
      mesh_name = mesh_name.lower()
      ## take out all commas, replace spaces with _
      mesh_disease_dict[mesh_name] = disease_name 
    
  return mesh_disease_dict 

