'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

// Define types for options
type SkinToneOption = {
  id: string
  value: string
}

type FeatureOption = {
  id: string
  svg: string
}

type FeatureCategory = {
  id: string
  name: string
  icon: string
  options: SkinToneOption[] | FeatureOption[]
}

// Helper functions to check option types
const isSkinToneOption = (option: SkinToneOption | FeatureOption): option is SkinToneOption => {
  return 'value' in option
}

const isFeatureOption = (option: SkinToneOption | FeatureOption): option is FeatureOption => {
  return 'svg' in option
}

// Define the feature categories and options
const featureCategories: FeatureCategory[] = [
  {
    id: 'skin-tone',
    name: 'Skin tone',
    icon: '⚪',
    options: [
      { id: 'light', value: '#F8D5C2' },
      { id: 'medium', value: '#E0B495' },
      { id: 'tan', value: '#C68C60' },
      { id: 'brown', value: '#8D5B3F' },
      { id: 'dark', value: '#513A35' },
      { id: 'black', value: '#291C19' },
    ] as SkinToneOption[]
  },
  {
    id: 'eyes',
    name: 'Eyes',
    icon: '👁️',
    options: [
      { id: 'eyes-1', svg: '•• ••' },
      { id: 'eyes-2', svg: '> <' },
      { id: 'eyes-3', svg: '> >' },
      { id: 'eyes-4', svg: '^ ^' },
      { id: 'eyes-5', svg: '- -' },
      { id: 'eyes-6', svg: '· ·' },
      { id: 'eyes-7', svg: '◠ ◠' },
      { id: 'eyes-8', svg: '◡ ◡' },
      { id: 'eyes-9', svg: '◉ ◉' },
    ] as FeatureOption[]
  },
  {
    id: 'brows',
    name: 'Brows',
    icon: '〰️',
    options: [
      { id: 'brows-1', svg: '︵ ︵' },
      { id: 'brows-2', svg: '︶ ︶' },
      { id: 'brows-3', svg: '⌒ ⌒' },
      { id: 'brows-4', svg: '⎯ ⎯' },
      { id: 'brows-5', svg: '/ \\' },
      { id: 'brows-6', svg: '\\ /' },
    ]
  },
  {
    id: 'nose',
    name: 'Nose',
    icon: '👃',
    options: [
      { id: 'nose-1', svg: '◡' },
      { id: 'nose-2', svg: '▽' },
      { id: 'nose-3', svg: '△' },
      { id: 'nose-4', svg: '⋀' },
      { id: 'nose-5', svg: '⌄' },
      { id: 'nose-6', svg: 'v' },
    ]
  },
  {
    id: 'mouth',
    name: 'Mouth',
    icon: '👄',
    options: [
      { id: 'mouth-1', svg: '◡' },
      { id: 'mouth-2', svg: '◠' },
      { id: 'mouth-3', svg: '⎯' },
      { id: 'mouth-4', svg: 'ᗢ' },
      { id: 'mouth-5', svg: 'ᗧ' },
      { id: 'mouth-6', svg: 'ω' },
    ]
  },
  {
    id: 'hair',
    name: 'Hair',
    icon: '💇',
    options: [
      { id: 'hair-1', svg: '⇑' },
      { id: 'hair-2', svg: '☁' },
      { id: 'hair-3', svg: '♦' },
      { id: 'hair-4', svg: '⋂' },
      { id: 'hair-5', svg: '◠◡◠' },
      { id: 'hair-6', svg: '✂' },
    ]
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: '🔍',
    options: [
      { id: 'accessories-1', svg: '◯' },
      { id: 'accessories-2', svg: '□' },
      { id: 'accessories-3', svg: '☆' },
      { id: 'accessories-4', svg: '♪' },
      { id: 'accessories-5', svg: '✓' },
      { id: 'accessories-6', svg: '⌘' },
    ]
  },
]

// Main component that uses searchParams
function CustomizeFaceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeCategory, setActiveCategory] = useState(featureCategories[0].id)
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [agentId, setAgentId] = useState<string | null>(null)

  // 获取URL参数中的Agent ID
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setAgentId(id)
      // 这里可以添加逻辑，根据agentId加载当前的面部配置
    } else {
      // 如果没有提供ID，跳转到创建页面
      router.push('/create')
    }
  }, [searchParams, router])

  // 初始化选择特征
  useEffect(() => {
    const initialFeatures: Record<string, string> = {}
    featureCategories.forEach(category => {
      if (category.options.length > 0) {
        initialFeatures[category.id] = category.options[0].id
      }
    })
    setSelectedFeatures(initialFeatures)
  }, [])

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [activeCategory]: featureId
    }))
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)

      if (!agentId) {
        console.error('No agent ID provided')
        return
      }

      // TODO: 保存选择的特征到API
      console.log('Saving face for agent:', agentId)
      console.log('Selected features:', selectedFeatures)

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 保存后导航到Agent详情或个人资料页
      router.push(`/agent-profile?id=${agentId}`)
    } catch (error) {
      console.error('Error saving face:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 获取当前活动分类数据
  const activeCategoryData = featureCategories.find(c => c.id === activeCategory)

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Customize Agent Face</h1>
          <div className="flex space-x-4">
            {agentId && (
              <Link
                href={`/edit-agent?id=${agentId}`}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Edit Agent Details
              </Link>
            )}
            <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800">
              Back to Home
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700">Features</h2>
              </div>
              <ul>
                {featureCategories.map(category => (
                  <li key={category.id} className="border-b border-gray-200 last:border-b-0">
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full flex items-center p-4 hover:bg-gray-100 transition-colors ${activeCategory === category.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                        }`}
                    >
                      <span className="mr-3 text-lg">{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 p-6 flex flex-col md:flex-row">
              <div className="w-full md:w-2/3 pr-0 md:pr-6 mb-6 md:mb-0">
                <h2 className="text-lg font-medium text-gray-700 mb-4">{activeCategoryData?.name}</h2>
                <div className="grid grid-cols-3 gap-4">
                  {activeCategoryData?.options.map(option => (
                    <div
                      key={option.id}
                      onClick={() => handleFeatureSelect(option.id)}
                      className={`aspect-w-1 aspect-h-1 border rounded-md hover:border-indigo-500 cursor-pointer flex items-center justify-center text-2xl h-24 
                        ${selectedFeatures[activeCategory] === option.id
                          ? 'border-2 border-indigo-500 bg-indigo-50'
                          : 'border-gray-200'
                        }`}
                      style={isSkinToneOption(option) ? { backgroundColor: option.value } : {}}
                    >
                      {isFeatureOption(option) ? option.svg : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-1/3">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Preview</h2>
                <div className="bg-white border border-gray-200 rounded-full aspect-square w-full max-w-xs mx-auto flex items-center justify-center">
                  <div className="relative w-4/5 h-4/5 flex flex-col items-center justify-center">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="face-container relative">
                        <div className="face-skin w-40 h-40 rounded-full mb-4"
                          style={{
                            backgroundColor:
                              featureCategories[0].options.find(
                                o => o.id === selectedFeatures['skin-tone']
                              ) && isSkinToneOption(featureCategories[0].options[0])
                                ? (featureCategories[0].options as SkinToneOption[]).find(
                                  o => o.id === selectedFeatures['skin-tone']
                                )?.value || '#E0B495'
                                : '#E0B495'
                          }}>
                        </div>

                        <div className="face-eyes absolute top-1/3 left-1/2 transform -translate-x-1/2 flex space-x-4 text-2xl">
                          {featureCategories[1].options.find(o => o.id === selectedFeatures['eyes']) &&
                            isFeatureOption(featureCategories[1].options[0])
                            ? (featureCategories[1].options as FeatureOption[]).find(o => o.id === selectedFeatures['eyes'])?.svg
                            : null}
                        </div>

                        <div className="face-brows absolute top-1/4 left-1/2 transform -translate-x-1/2 flex space-x-4 text-xl">
                          {featureCategories[2].options.find(o => o.id === selectedFeatures['brows']) &&
                            isFeatureOption(featureCategories[2].options[0])
                            ? (featureCategories[2].options as FeatureOption[]).find(o => o.id === selectedFeatures['brows'])?.svg
                            : null}
                        </div>

                        <div className="face-nose absolute top-1/2 left-1/2 transform -translate-x-1/2 text-xl">
                          {featureCategories[3].options.find(o => o.id === selectedFeatures['nose']) &&
                            isFeatureOption(featureCategories[3].options[0])
                            ? (featureCategories[3].options as FeatureOption[]).find(o => o.id === selectedFeatures['nose'])?.svg
                            : null}
                        </div>

                        <div className="face-mouth absolute top-2/3 left-1/2 transform -translate-x-1/2 text-xl">
                          {featureCategories[4].options.find(o => o.id === selectedFeatures['mouth']) &&
                            isFeatureOption(featureCategories[4].options[0])
                            ? (featureCategories[4].options as FeatureOption[]).find(o => o.id === selectedFeatures['mouth'])?.svg
                            : null}
                        </div>

                        <div className="face-hair absolute top-0 left-1/2 transform -translate-x-1/2 text-4xl">
                          {featureCategories[5].options.find(o => o.id === selectedFeatures['hair']) &&
                            isFeatureOption(featureCategories[5].options[0])
                            ? (featureCategories[5].options as FeatureOption[]).find(o => o.id === selectedFeatures['hair'])?.svg
                            : null}
                        </div>

                        <div className="face-accessories absolute bottom-1/4 right-1/4 text-xl">
                          {featureCategories[6].options.find(o => o.id === selectedFeatures['accessories']) &&
                            isFeatureOption(featureCategories[6].options[0])
                            ? (featureCategories[6].options as FeatureOption[]).find(o => o.id === selectedFeatures['accessories'])?.svg
                            : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/agent-profile')}
              className="border-gray-300 text-gray-700"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Face'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading fallback for Suspense
function CustomizeFaceLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading face customization...</p>
      </div>
    </div>
  )
}

// Wrapper component with Suspense
export default function CustomizeFacePage() {
  return (
    <Suspense fallback={<CustomizeFaceLoading />}>
      <CustomizeFaceContent />
    </Suspense>
  )
} 