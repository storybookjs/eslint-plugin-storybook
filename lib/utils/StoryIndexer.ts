import {
  PropertiesMap,
  PropertyDefinition,
  SpreadContentCandidates,
  SpreadsMap,
  StoriesMap,
  StoryDeclarationCandidates,
  StoryExports,
  StoryPropertyCandidates,
  StoryPropertyDeclaration,
} from '../types/stories'

export class StoryIndexer {
  /** List of all Stories (indexed by their exported name). */
  stories: StoriesMap = new Map()

  /** List of all Stories properties (indexed by name). */
  properties: PropertiesMap = new Map()

  /**
   * List of all spreads used on Stories (indexed by their name).
   * Each spread item resolves to the exported name of the Story they are
   * attached to. This is used internally and has no reason to be public.
   */
  private spreads: SpreadsMap = new Map()

  constructor(
    propertyCandidates: StoryPropertyCandidates,
    declarationCandidates: StoryDeclarationCandidates,
    spreadCandidates: SpreadContentCandidates,
    storyExports: StoryExports
  ) {
    this.registerStories(storyExports, declarationCandidates)
    this.registerSpreads(spreadCandidates)
    this.registerProperties(propertyCandidates)
  }

  /** Output list of stories. May be filtered by one or several names. */
  public getStories(q?: string | string[]) {
    const stories = [...this.stories.entries()]
    const outputStories = (list: typeof stories) =>
      list.map(([, storyDeclaration]) => storyDeclaration)

    if (!q) return outputStories(stories)

    const search = Array.isArray(q) ? q : [q]
    return outputStories(
      stories.filter(([storyName]) => {
        return search.includes(storyName)
      })
    )
  }

  /**
   * Output list of properties. May be filtered by one or several names.
   * Each output property is an object containing the following:
   * - `storyName`: Name of the Story the property is attached to.
   * - `valueNode`: Node of property's value.
   * - `nameNode`: Node of property's name.
   */
  public getProperties(q?: string | string[]) {
    const properties = [...this.properties.entries()]
    const search = Array.isArray(q) ? q : [q]
    return properties.reduce((pickedProperties, [propertyName, propertyInstances]) => {
      propertyInstances.forEach((propertyInstance) => {
        if (!q || search.includes(propertyName)) {
          pickedProperties.push(propertyInstance)
        }
      })
      return pickedProperties
    }, [] as StoryPropertyDeclaration[])
  }

  /** Registers stories and map them to their declaration. */
  private registerStories(
    storyExports: StoryExports,
    declarationCandidates: StoryDeclarationCandidates
  ) {
    const exports = [...storyExports.entries()]
    exports.forEach(([name, declaration]) => {
      if (declaration) {
        this.stories.set(name, declaration)
      } else {
        const declaration = declarationCandidates.get(name)?.declarationValue
        if (declaration) this.stories.set(name, declaration)
      }
    })
  }

  /** Registers spread elements used on Stories. */
  private registerSpreads(spreadCandidates: SpreadContentCandidates) {
    const possibleSpreads = [...spreadCandidates.entries()]
    possibleSpreads.forEach(([spreadName, parentNames]) => {
      parentNames.forEach((parentName) => {
        if (this.stories.has(parentName)) {
          this.spreads.set(spreadName, parentNames)
        }
      })
    })
  }

  /** Registers story properties. */
  private registerProperties(propertyCandidates: StoryPropertyCandidates) {
    const possibleProperties = [...propertyCandidates.values()]

    possibleProperties.forEach((property) => {
      const { parentName } = property

      // This is indeed a Story property.
      if (this.stories.has(parentName)) {
        this.addProperty(property)
      }

      // Property's parent object is spread within a Story declaration.
      if (this.spreads.has(parentName)) {
        const [storyName] = this.spreads.get(parentName) as [string]
        this.addProperty({ ...property, parentName: storyName })
      }
    })
  }

  /** Adds property to list of properties. */
  private addProperty({
    parentName,
    propertyName: name,
    propertyNameNode: nameNode,
    propertyValueNode: valueNode,
  }: PropertyDefinition) {
    this.properties.set(name, [
      ...(this.properties.get(name) ?? []),
      { storyName: parentName, nameNode, valueNode },
    ])
  }
}
