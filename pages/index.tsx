import Head from "next/head"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowRight,
  Copy,
  FileText,
  Lightbulb,
  ListStart,
  Loader2,
  Pencil,
  Zap,
} from "lucide-react"

import { siteConfig } from "@/config/site"
import { DissertInfo } from "@/lib/dis_info"
import { Layout } from "@/components/layout"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

const { Configuration, OpenAIApi } = require("openai")

export default function IndexPage() {
  let model = "gpt-4"
  let task =
    "Rédige l'introduction (amorce, présentation du sujet, problématique et annonce du plan), le contenu de la dissertation organisé en au moins deux grandes parties (I, II, III etc.) contenant chacune au moins deux sous-parties (A, B, etc.) (avec des citations), et la conclusion du sujet suivant : "
  let disserts: DissertInfo[] = []
  let k = ""
  if (typeof window !== "undefined") {
    k = localStorage.getItem("key")
    disserts = JSON.parse(localStorage.getItem("disserts") ?? "[]")
  }
  async function sendSubject() {
    let subject: string = (
      document.getElementById("subject") as HTMLInputElement
    ).value
    let key: string = (document.getElementById("pwr") as HTMLInputElement).value

    if (key === "") {
      alert("Spécifiez un clé d&apos;API OpenAI")
      return
    }

    localStorage.setItem("key", key)

    if (subject === "") {
      alert("Spécifiez un sujet !")
      return
    }
    ;(document.getElementById("send") as HTMLButtonElement).disabled = true
    document.getElementById("wait").classList.remove("hidden")
    const configuration = new Configuration({
      apiKey: key,
    })
    const openai = new OpenAIApi(configuration)
    try {
      const completion = await openai.createChatCompletion({
        model: model,
        messages: [
          {
            role: "system",
            content:
              "Tu es un expert qui fait des dissertations type bac de français. Tes réponses sont écrites et mises en forme en HTML",
          },
          {
            role: "user",
            content: task + subject,
          },
        ],
      })
      let res = completion.data.choices[0].message.content
      disserts.push({ subject: subject, content: res })
      document.getElementById("response").innerHTML = res
      ;(document.getElementById("send") as HTMLButtonElement).disabled = false
      document.getElementById("wait").classList.remove("hidden")
      document.getElementById("wait").classList.add("hidden")
      localStorage.setItem("disserts", JSON.stringify(disserts))
    } catch (error) {
      alert("An error occured:\n" + error)
      document.getElementById("wait").classList.add("hidden")
      ;(document.getElementById("send") as HTMLButtonElement).disabled = false
    }
  }

  function copy() {
    navigator.clipboard.writeText(document.getElementById("response").innerText)
  }

  function changeModel(v) {
    model = v
  }

  function changeGoal(v) {
    switch (v) {
      case "plan":
        task =
          "Rédige uniquement le plan de la dissertation organisé en au moins deux grandes parties (I, II, III etc.) contenant chacune au moins deux sous-parties contenant des exemples/citations (A, B, etc.) du sujet suivant : "
        break
      case "intro-ccl":
        task =
          "Rédige l'introduction (amorce, présentation du sujet, problématique et annonce du plan) et la conclusion du sujet suivant : "
        break

      default:
        task =
          "Rédige l'introduction (amorce, présentation du sujet, problématique et annonce du plan), le contenu de la dissertation organisé en au moins deux grandes parties (I, II, III etc.) contenant chacune au moins deux sous-parties (A, B, etc.) (avec des citations), et la conclusion du sujet suivant : "
        break
    }
  }
  return (
    <Layout>
      <Head>
        <title>DissertGPT</title>
        <meta
          name="description"
          content="Créez des dissertations en français avec GPT-4."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="m-2">
        <h2 className="font-bold">Informations</h2>
        <p>Entrez les informations concernant votre sujet.</p>
      </section>
      <section id="infos" className="flex flex-col items-center space-y-2 m-2">
        <div className="w-full flex flex-col space-y-2 sm:space-y-0 sm:space-x-2 sm:flex-row">
          <Input
            id="pwr"
            type="password"
            placeholder="Clé d'API OpenAI"
            defaultValue={k}
          />
          <Select onValueChange={changeModel} defaultValue="gpt-4">
            <SelectTrigger className="sm:w-[150px]">
              <SelectValue placeholder="Modèle" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Modèle</SelectLabel>
                <SelectItem value="gpt-4">
                  <div className="flex space-x-1 items-center">
                    <Zap size={16} />
                    <p>GPT-4</p>
                  </div>
                </SelectItem>
                <SelectItem value="gpt-3.5-turbo">
                  <div className="flex space-x-1 items-center">
                    <Lightbulb size={16} />
                    <p>GPT-3.5</p>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={changeGoal} defaultValue="full">
            <SelectTrigger className="sm:w-[240px]">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Mode</SelectLabel>
                <SelectItem value="full">
                  <div className="flex space-x-1 items-center">
                    <FileText size={16} />
                    <p>Dissertation</p>
                  </div>
                </SelectItem>
                <SelectItem className="flex space-x-1" value="plan">
                  <div className="flex space-x-1 items-center">
                    <Pencil size={16} />
                    <p>Plan</p>
                  </div>
                </SelectItem>
                <SelectItem className="flex space-x-1" value="intro-ccl">
                  <div className="flex space-x-1 items-center">
                    <ListStart size={16} />
                    <p>Intro et Conclusion</p>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Textarea
          id="subject"
          placeholder="Entrez votre sujet de dissertation ici"
        />

        <div className="space-x-2">
          <Button id="send" onClick={sendSubject}>
            <ArrowRight className="mr-2" size={16} />
            Envoyer le sujet
          </Button>
          <Button variant="outline" id="send" onClick={copy}>
            <Copy className="mr-2" size={16} />
            Copier le résultat
          </Button>
        </div>
      </section>
      <Separator className="my-4" />
      <section className="m-2">
        <h2 className="font-bold">Résultat</h2>
        <p>
          Votre dissertation s&apos;affichera ici. Le processus peut prendre du
          temps.
        </p>
        <div className="flex flex-col md:flex-row items-center space-x-2 p-5 m-2 rounded-xl dark:bg-orange-900 bg-orange-200 text-orange-800 dark:text-orange-200">
          <AlertTriangle className="mr-2" size={24} />
          DissertGPT peut générer du contenu pouvant avoir des inexacitudes, et
          être offensant. La mise en forme de la page peut aussi être
          incorrecte.
        </div>
      </section>
      <section id="wait" className="hidden">
        <div className="flex flex-col justify-center items-center">
          <Loader2 className="animate-spin" size={96} />
          <h3>Contenu en cours de génération</h3>
        </div>
      </section>
      <section className="m-2" id="response"></section>
    </Layout>
  )
}
