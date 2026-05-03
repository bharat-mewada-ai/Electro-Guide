import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

async function main() {
  await prisma.candidate.createMany({
    data: [
      { name: 'Aditi Sharma', party: 'Independent', education: 'PhD Economics', assets: '₹2.4 Cr', cases: 0, state: 'Maharashtra' },
      { name: 'Rajesh Kumar', party: 'National Party', education: 'MA Law', assets: '₹12.5 Cr', cases: 1, state: 'Maharashtra' },
      { name: 'Sarah Joseph', party: 'Social Alliance', education: 'Social Work', assets: '₹85 Lakh', cases: 0, state: 'Delhi' },
    ]
  })

  await prisma.misinformationFact.createMany({
    data: [
      {
        keywords: 'hack,machine,evm',
        verdict: 'FALSE',
        explanation: 'EVMs are standalone, non-networked machines with multi-layer hardware/software security. They are physically sealed and tested in front of political agents.',
        confidence: 0.99
      },
      {
        keywords: 'online,internet,whatsapp,mobile',
        verdict: 'FALSE',
        explanation: 'India does not allow online or mobile voting. You must physically visit your designated polling booth with a valid ID.',
        confidence: 0.98
      },
      {
        keywords: 'ink,remove,chemical',
        verdict: 'FALSE',
        explanation: 'Indelible ink is designed to stay for weeks. Attempting to remove it can damage the skin and is a punishable offense under election law.',
        confidence: 0.95
      },
      {
        keywords: 'holiday,work',
        verdict: 'TRUE',
        explanation: 'Election day is a mandatory paid public holiday for all employees (including private sectors) to ensure everyone can vote.',
        confidence: 0.92
      }
    ]
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
